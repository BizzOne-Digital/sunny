import { mkdir, writeFile } from "fs/promises";
import path from "path";
import slugify from "slugify";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { saveMediaFile } from "@/lib/media-file";

export type MediaUploadResult = {
  url: string;
  width?: number;
  height?: number;
  bytes?: number;
  storage: "cloudinary" | "local" | "mongo";
};

export function isUploadedMediaUrl(url?: string) {
  if (!url) return false;
  return url.startsWith("/uploads/") || url.startsWith("/api/media/file/");
}

function hasCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  return Boolean(cloudName && (uploadPreset || (apiKey && apiSecret)));
}

function preferLocalDisk() {
  // Local disk only for local development — ephemeral on Vercel/serverless.
  if (process.env.VERCEL) return false;
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_UPLOADS !== "true") {
    return false;
  }
  return process.env.MEDIA_STORAGE?.trim().toLowerCase() === "local";
}

function preferMongoOnly() {
  return process.env.MEDIA_STORAGE?.trim().toLowerCase() === "mongo";
}

async function uploadToLocal(file: File): Promise<MediaUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name).toLowerCase() || ".png";
  const base = slugify(path.basename(file.name, ext), { lower: true, strict: true }) || "upload";
  const filename = `${base}-${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return {
    url: `/uploads/${filename}`,
    bytes: buffer.length,
    storage: "local",
  };
}

async function uploadToMongo(file: File): Promise<MediaUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  // MongoDB docs max ~16MB; base64 expands ~33%, keep a safe ceiling.
  if (buffer.length > 8 * 1024 * 1024) {
    throw new Error("Image is too large (max 8MB). Compress it and try again.");
  }
  const ext = path.extname(file.name).toLowerCase() || ".png";
  const base = slugify(path.basename(file.name, ext), { lower: true, strict: true }) || "upload";
  const id = `${base}-${Date.now()}`;
  const saved = await saveMediaFile({
    id,
    filename: `${id}${ext}`,
    contentType: file.type || "image/png",
    buffer,
  });

  return {
    url: saved.url,
    bytes: saved.bytes,
    storage: "mongo",
  };
}

export async function uploadMediaFile(file: File, folder = "dtdogs"): Promise<MediaUploadResult> {
  const storageMode = process.env.MEDIA_STORAGE?.trim().toLowerCase();

  if (preferLocalDisk()) {
    return uploadToLocal(file);
  }

  // Prefer Mongo on deploy when explicitly requested, or when Cloudinary is flaky.
  if (storageMode === "mongo" || preferMongoOnly()) {
    return uploadToMongo(file);
  }

  if (hasCloudinaryCredentials()) {
    try {
      const result = await uploadToCloudinary(file, folder);
      return {
        url: result.secure_url,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        storage: "cloudinary",
      };
    } catch (error) {
      console.warn("Cloudinary upload failed, storing in MongoDB instead:", error);
    }
  }

  // Durable storage for local + deployed environments (MongoDB Atlas survives deploys).
  return uploadToMongo(file);
}
