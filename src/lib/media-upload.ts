import { mkdir, writeFile } from "fs/promises";
import path from "path";
import slugify from "slugify";
import { uploadToCloudinary } from "@/lib/cloudinary";

export type MediaUploadResult = {
  url: string;
  width?: number;
  height?: number;
  bytes?: number;
  storage: "cloudinary" | "local";
};

function hasCloudinaryCredentials() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
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

export async function uploadMediaFile(file: File, folder = "dtdogs"): Promise<MediaUploadResult> {
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
      console.warn("Cloudinary upload failed, saving locally instead:", error);
    }
  }

  return uploadToLocal(file);
}
