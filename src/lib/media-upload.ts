import {
  deleteFolderUploadByUrl,
  saveFolderUpload,
  type UploadFolder,
} from "@/lib/upload/store";

export type MediaUploadResult = {
  url: string;
  width?: number;
  height?: number;
  bytes?: number;
  storage: "mongo";
  filename?: string;
  folder?: UploadFolder;
};

/** Uploaded/replaced media that must bypass Next image optimization / seed remaps. */
export function isDynamicMediaUrl(url?: string) {
  if (!url) return false;
  return (
    url.startsWith("/api/uploads/") ||
    url.startsWith("/api/media/file/") ||
    url.startsWith("data:image/") ||
    url.startsWith("https://res.cloudinary.com/")
  );
}

export function isUploadedMediaUrl(url?: string) {
  return isDynamicMediaUrl(url);
}

function folderFromTag(folderHint?: string): UploadFolder {
  const value = (folderHint || "").toLowerCase();
  if (value === "products" || value.includes("product")) return "products";
  if (value === "gallery" || value.includes("gallery")) return "gallery";
  if (value === "pages" || value.includes("page") || value.includes("service") || value.includes("blog")) {
    return "pages";
  }
  return "misc";
}

/**
 * Admin media upload — always MongoDB (Vercel-safe). Never writes to public/.
 */
export async function uploadMediaFile(file: File, folderHint = "pages"): Promise<MediaUploadResult> {
  const folder = folderFromTag(folderHint);
  const saved = await saveFolderUpload(file, folder);
  return {
    url: saved.url,
    bytes: saved.size,
    storage: "mongo",
    filename: saved.filename,
    folder: saved.folder,
  };
}

export async function deleteUploadedMediaUrl(url: string) {
  return deleteFolderUploadByUrl(url);
}
