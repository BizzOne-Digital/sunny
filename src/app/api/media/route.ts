import { NextResponse } from "next/server";
import slugify from "slugify";
import { getAdminSession } from "@/lib/auth";
import { uploadMediaFile } from "@/lib/media-upload";
import { connectMongo, ImageAsset, Models } from "@/lib/site";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }

  try {
    const upload = await uploadMediaFile(file, "dtdogs/pages");
    const title = String(form.get("title") ?? file.name);
    const asset: ImageAsset = {
      id: `${slugify(title, { lower: true, strict: true })}-${Date.now()}`,
      title,
      alt: String(form.get("alt") ?? title),
      caption: String(form.get("caption") ?? ""),
      url: upload.url,
      width: upload.width ?? 1400,
      height: upload.height ?? 1000,
      fileSize: upload.bytes ?? file.size,
      page: String(form.get("page") ?? ""),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: "published",
      focalPoint: {
        x: Number(form.get("focalX") ?? 50),
        y: Number(form.get("focalY") ?? 50),
      },
    };

    await Models.MediaAsset().updateOne({ id: asset.id }, { $set: asset }, { upsert: true });

    return NextResponse.json({
      asset,
      storage: upload.storage,
      message:
        upload.storage === "cloudinary"
          ? "Uploaded to Cloudinary."
          : upload.storage === "mongo"
            ? "Saved to MongoDB. Works after deploy (Atlas)."
            : "Saved locally (dev only).",
    });
  } catch (error) {
    console.error("Upload error details:", error);
    const errorMessage = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
