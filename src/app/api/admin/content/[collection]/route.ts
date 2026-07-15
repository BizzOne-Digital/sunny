import { NextResponse } from "next/server";
import type { Model } from "mongoose";
import { getAdminSession } from "@/lib/auth";
import { CollectionName, collectionModelMap, connectMongo } from "@/lib/site";

export async function GET(_: Request, { params }: { params: Promise<{ collection: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collection: rawCollection } = await params;
  const collection = rawCollection as CollectionName;
  const modelFactory = collectionModelMap[collection];
  if (!modelFactory) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  const ModelCtor = modelFactory() as unknown as Model<Record<string, unknown>>;
  const docs = await ModelCtor.find({}).lean();
  return NextResponse.json(docs);
}

export async function PUT(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collection: rawCollection } = await params;
  const collection = rawCollection as CollectionName;
  const modelFactory = collectionModelMap[collection];
  if (!modelFactory) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  const body = await request.json();
  const keyValue = body.slug ?? body.id;
  if (!keyValue) return NextResponse.json({ error: "Item must include slug or id." }, { status: 400 });

  const key = body.slug ? { slug: body.slug } : { id: body.id };
  const ModelCtor = modelFactory() as unknown as Model<Record<string, unknown>>;
  await ModelCtor.updateOne(key, { $set: body }, { upsert: true });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collection: rawCollection } = await params;
  const collection = rawCollection as CollectionName;
  const modelFactory = collectionModelMap[collection];
  if (!modelFactory) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  const { slug, id } = await request.json();
  const ModelCtor = modelFactory() as unknown as Model<Record<string, unknown>>;
  await ModelCtor.deleteOne(slug ? { slug } : { id });

  return NextResponse.json({ ok: true });
}
