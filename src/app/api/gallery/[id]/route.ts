import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Model } from "mongoose";
import { getAdminSession } from "@/lib/auth";
import { Models, connectMongo } from "@/lib/site";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  try {
    const { id } = await params;
    const body = await request.json();
    const GalleryModel = Models.Gallery() as unknown as Model<Record<string, unknown>>;
    const existing = await GalleryModel.findOne({ id }).lean();
    if (!existing) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    const next = {
      ...JSON.parse(JSON.stringify(existing)),
      ...body,
      id,
      tags: Array.isArray(body.tags)
        ? body.tags
        : String(body.tags ?? "")
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean),
    };

    await GalleryModel.updateOne({ id }, { $set: next });
    revalidatePath("/gallery");
    return NextResponse.json({ ok: true, gallery: next });
  } catch (error) {
    console.error("Update gallery image error:", error);
    return NextResponse.json({ error: "Unable to update gallery image." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  try {
    const { id } = await params;
    const GalleryModel = Models.Gallery() as unknown as Model<Record<string, unknown>>;
    await GalleryModel.deleteOne({ id });
    revalidatePath("/gallery");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    return NextResponse.json({ error: "Unable to delete gallery image." }, { status: 500 });
  }
}
