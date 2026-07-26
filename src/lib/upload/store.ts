import slugify from "slugify";
import path from "path";
import connectDB from "@/lib/db";
import StoredUploadModel, {
  UPLOAD_FOLDERS,
  type UploadFolder,
} from "@/models/StoredUpload";

export { UPLOAD_FOLDERS, type UploadFolder };

export const MAX_UPLOAD_BYTES = Math.floor(4.5 * 1024 * 1024);

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function isSafeUploadFilename(filename: string) {
  return Boolean(filename) && /^[a-zA-Z0-9._-]+$/.test(filename) && !filename.includes("..");
}

export function uploadPublicUrl(folder: UploadFolder, filename: string) {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseUploadUrl(url: string): { folder: UploadFolder; filename: string } | null {
  if (!url?.startsWith("/api/uploads/")) return null;
  const parts = url.replace(/^\/api\/uploads\//, "").split("/");
  if (parts.length !== 2) return null;
  const [folder, filename] = parts;
  if (!isUploadFolder(folder) || !isSafeUploadFilename(filename)) return null;
  return { folder, filename };
}

function normalizeMime(file: File) {
  const mime = (file.type || "").toLowerCase();
  if (ALLOWED_MIME.has(mime)) return mime === "image/jpg" ? "image/jpeg" : mime;
  const ext = path.extname(file.name).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "";
}

function buildFilename(file: File, mimeType: string) {
  const originalExt = path.extname(file.name).toLowerCase();
  const ext = EXT_BY_MIME[mimeType] || originalExt || ".jpg";
  const base =
    slugify(path.basename(file.name, originalExt || ext), { lower: true, strict: true }) || "upload";
  return `${base}-${Date.now()}${ext}`;
}

export type SaveFolderUploadResult = {
  url: string;
  filename: string;
  folder: UploadFolder;
  size: number;
  mimeType: string;
};

export async function saveFolderUpload(file: File, folder: UploadFolder): Promise<SaveFolderUploadResult> {
  await connectDB();

  const mimeType = normalizeMime(file);
  if (!mimeType || !ALLOWED_MIME.has(mimeType)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!bytes.length) throw new Error("Uploaded file was empty.");
  if (bytes.length > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large (max 4.5MB). Compress it and try again.");
  }

  const filename = buildFilename(file, mimeType);
  const Model = StoredUploadModel();

  await Model.updateOne(
    { folder, filename },
    {
      $set: {
        folder,
        filename,
        mimeType,
        size: bytes.length,
        data: bytes,
      },
    },
    { upsert: true },
  );

  const saved = await Model.findOne({ folder, filename }).select("filename folder size mimeType").lean();
  if (!saved) {
    throw new Error("Upload write verification failed. Check MongoDB Atlas connection.");
  }

  return {
    url: uploadPublicUrl(folder, filename),
    filename,
    folder,
    size: bytes.length,
    mimeType,
  };
}

export async function getFolderUpload(folder: UploadFolder, filename: string) {
  await connectDB();
  if (!isUploadFolder(folder) || !isSafeUploadFilename(filename)) return null;
  return StoredUploadModel().findOne({ folder, filename }).exec();
}

export async function deleteFolderUploadByUrl(url: string) {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;
  await connectDB();
  const result = await StoredUploadModel().deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });
  return result.deletedCount > 0;
}

export function toUploadBuffer(data: unknown): Buffer | null {
  if (data == null) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (typeof data === "object") {
    const record = data as {
      buffer?: ArrayBuffer | Buffer | Uint8Array;
      data?: number[] | Buffer;
      value?: (asEnd?: boolean) => Buffer;
    };
    if (typeof record.value === "function") {
      try {
        return record.value(true);
      } catch {
        try {
          return record.value();
        } catch {
          return null;
        }
      }
    }
    if (Array.isArray(record.data)) return Buffer.from(record.data);
    if (Buffer.isBuffer(record.data)) return record.data;
    if (record.buffer instanceof ArrayBuffer) return Buffer.from(record.buffer);
    if (Buffer.isBuffer(record.buffer)) return Buffer.from(record.buffer);
    if (record.buffer instanceof Uint8Array) return Buffer.from(record.buffer);
  }
  return null;
}
