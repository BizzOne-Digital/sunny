import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Model } from "mongoose";
import { getAdminSession } from "@/lib/auth";
import { Models, connectMongo, gallerySlotImages, syncGalleryImages } from "@/lib/site";

export async function GET() {
  try {
    if (!(await connectMongo())) {
      return NextResponse.json(gallerySlotImages);
    }

    await syncGalleryImages();
    const GalleryModel = Models.Gallery() as unknown as Model<Record<string, unknown>>;
    const docs = await GalleryModel.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(docs)));
  } catch (error) {
    console.error("Get gallery images error:", error);
    return NextResponse.json({ error: "Unable to load gallery images." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  try {
    const body = await request.json();
    if (!body?.id || !body?.url) {
      return NextResponse.json({ error: "Image id and url are required." }, { status: 400 });
    }

    const GalleryModel = Models.Gallery() as unknown as Model<Record<string, unknown>>;
    const count = await GalleryModel.countDocuments();
    const item = {
      id: String(body.id),
      title: String(body.title ?? "Gallery image"),
      alt: String(body.alt ?? body.title ?? "Gallery image"),
      caption: String(body.caption ?? ""),
      url: String(body.url),
      width: Number(body.width ?? 1400),
      height: Number(body.height ?? 1000),
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status ?? "published",
      order: Number(body.order ?? count + 1),
      page: "gallery",
    };

    await GalleryModel.updateOne({ id: item.id }, { $set: item }, { upsert: true });
    revalidatePath("/gallery");
    return NextResponse.json({ ok: true, gallery: item }, { status: 201 });
  } catch (error) {
    console.error("Create gallery image error:", error);
    return NextResponse.json({ error: "Unable to create gallery image." }, { status: 500 });
  }
}
