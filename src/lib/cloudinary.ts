import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

function readEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function configureCloudinary() {
  const cloudName = readEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = readEnv("CLOUDINARY_API_KEY");
  const apiSecret = readEnv("CLOUDINARY_API_SECRET");

  if (!cloudName) {
    throw new Error("Cloudinary credentials are required for media uploads. Missing: cloudName");
  }

  // Unsigned uploads only need cloud name + upload preset.
  const uploadPreset = readEnv("CLOUDINARY_UPLOAD_PRESET");
  if (!uploadPreset && (!apiKey || !apiSecret)) {
    throw new Error(
      `Cloudinary credentials are required for media uploads. Missing: ${!apiKey ? "apiKey " : ""}${!apiSecret ? "apiSecret" : ""}`,
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey || undefined,
    api_secret: apiSecret || undefined,
    secure: true,
  });

  return cloudinary;
}

function cloudinaryErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const record = error as { message?: string; http_code?: number; error?: { message?: string } };
    const detail = record.error?.message ?? record.message ?? "Unknown error";
    const code = record.http_code ? ` (${record.http_code})` : "";
    return `${detail}${code}`;
  }
  return error instanceof Error ? error.message : "Unknown error";
}

export async function uploadToCloudinary(file: File, folder = "dtdogs") {
  const cloudinaryInstance = configureCloudinary();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadPreset = readEnv("CLOUDINARY_UPLOAD_PRESET");

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const callback = (error: unknown, uploadResult?: UploadApiResponse) => {
        if (error) reject(error);
        else if (uploadResult) resolve(uploadResult);
        else reject(new Error("Cloudinary returned no upload result."));
      };

      if (uploadPreset) {
        // Works even when API key permissions block signed uploads (403).
        // Folder and most options must be configured on the unsigned preset itself.
        cloudinaryInstance.uploader.unsigned_upload_stream(uploadPreset, callback).end(buffer);
        return;
      }

      cloudinaryInstance.uploader
        .upload_stream({ folder, resource_type: "image", overwrite: false }, callback)
        .end(buffer);
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload to Cloudinary: ${cloudinaryErrorMessage(error)}`);
  }
}
