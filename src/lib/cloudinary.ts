import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

function readEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function configureCloudinary() {
  const cloudName = readEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = readEnv("CLOUDINARY_API_KEY");
  const apiSecret = readEnv("CLOUDINARY_API_SECRET");

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      `Cloudinary credentials are required for media uploads. Missing: ${!cloudName ? "cloudName " : ""}${!apiKey ? "apiKey " : ""}${!apiSecret ? "apiSecret" : ""}`,
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
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

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinaryInstance.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          overwrite: false,
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else if (uploadResult) resolve(uploadResult);
          else reject(new Error("Cloudinary returned no upload result."));
        },
      );
      stream.end(buffer);
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload to Cloudinary: ${cloudinaryErrorMessage(error)}`);
  }
}
