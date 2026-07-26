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

/** Uploaded/replaced media that must bypass Next image optimization / seed remaps. */
export function isDynamicMediaUrl(url?: string) {
  if (!url) return false;
  return (
    url.startsWith("data:image/") ||
    url.startsWith("/uploads/") ||
    url.startsWith("/api/media/file/") ||
    url.startsWith("https://res.cloudinary.com/")
  );
}

export function isUploadedMediaUrl(url?: string) {
  return isDynamicMediaUrl(url);
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
  // Keep payloads small enough for Vercel request limits when saved into page docs.
  if (buffer.length > 1.5 * 1024 * 1024) {
    throw new Error("Image is too large (max 1.5MB). Compress it and try again.");
  }

  const ext = path.extname(file.name).toLowerCase() || ".png";
  const base = slugify(path.basename(file.name, ext), { lower: true, strict: true }) || "upload";
  const id = `${base}-${Date.now()}`;
  const contentType = file.type || "image/png";
  const dataBase64 = buffer.toString("base64");

  // Keep a MediaFile copy for /api/media/file fallback, but pages store a data URL
  // so the live site never depends on a separate file fetch.
  await saveMediaFile({
    id,
    filename: `${id}${ext}`,
    contentType,
    buffer,
  });

  return {
    url: `data:${contentType};base64,${dataBase64}`,
    bytes: buffer.length,
    storage: "mongo",
  };
}

export async function uploadMediaFile(file: File, folder = "dtdogs"): Promise<MediaUploadResult> {
  const storageMode = process.env.MEDIA_STORAGE?.trim().toLowerCase();

  if (preferLocalDisk()) {
    return uploadToLocal(file);
  }

  // Vercel/mongo: embed as data URL so live pages update without a separate file CDN.
  if (process.env.VERCEL || storageMode === "mongo" || preferMongoOnly()) {
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

  return uploadToMongo(file);
}
