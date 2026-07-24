import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Model } from "mongoose";
import { getAdminSession } from "@/lib/auth";
import { CollectionName, collectionModelMap, connectMongo } from "@/lib/site";

function revalidateForCollection(collection: CollectionName, body?: Record<string, unknown>) {
  switch (collection) {
    case "faqs":
      revalidatePath("/faq");
      break;
    case "services":
      revalidatePath("/services");
      revalidatePath("/");
      if (typeof body?.slug === "string") revalidatePath(`/services/${body.slug}`);
      break;
    case "pages":
      if (typeof body?.slug === "string") revalidatePath(`/${body.slug}`);
      break;
    case "pricing":
      revalidatePath("/pricing");
      break;
    case "products":
      revalidatePath("/shop");
      revalidatePath("/gift-cards");
      revalidatePath("/");
      break;
    case "team":
      revalidatePath("/team");
      break;
    case "blog":
      revalidatePath("/blog");
      if (typeof body?.slug === "string") revalidatePath(`/blog/${body.slug}`);
      break;
    case "testimonials":
      revalidatePath("/testimonials");
      revalidatePath("/");
      break;
    default:
      break;
  }
}

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
  revalidateForCollection(collection, body);

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
  revalidateForCollection(collection, slug ? { slug } : id ? { id } : undefined);

  return NextResponse.json({ ok: true });
}
