import mongoose, { Schema, type Model } from "mongoose";
import { connectMongo } from "@/lib/site";

export type StoredMediaFile = {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  /** Preferred durable payload — survives lean()/JSON better than Buffer. */
  dataBase64?: string;
  /** Legacy binary field (older uploads). */
  data?: Buffer;
};

const mediaFileSchema = new Schema<StoredMediaFile>(
  {
    id: { type: String, required: true, unique: true, index: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    dataBase64: { type: String },
    data: { type: Buffer },
  },
  { timestamps: true },
);

function MediaFileModel() {
  return (
    (mongoose.models.MediaFile as Model<StoredMediaFile>) ||
    mongoose.model<StoredMediaFile>("MediaFile", mediaFileSchema)
  );
}

export function toNodeBuffer(data: unknown): Buffer | null {
  if (data == null) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (typeof data === "string") {
    const raw = data.includes("base64,") ? data.split("base64,").pop()! : data;
    return Buffer.from(raw, "base64");
  }
  if (typeof data === "object") {
    const record = data as {
      _bsontype?: string;
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
          /* fall through */
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

export async function saveMediaFile(input: {
  id: string;
  filename: string;
  contentType: string;
  buffer: Buffer;
}) {
  if (!(await connectMongo())) {
    throw new Error("MONGODB_URI is required to store uploaded media.");
  }

  const dataBase64 = input.buffer.toString("base64");
  if (!dataBase64) {
    throw new Error("Uploaded file was empty.");
  }

  await MediaFileModel().updateOne(
    { id: input.id },
    {
      $set: {
        id: input.id,
        filename: input.filename,
        contentType: input.contentType || "application/octet-stream",
        size: input.buffer.length,
        dataBase64,
      },
      $unset: { data: 1 },
    },
    { upsert: true },
  );

  // Confirm the write landed (helps catch silent Atlas / connection issues).
  const saved = await MediaFileModel().findOne({ id: input.id }).select("id size dataBase64").lean();
  if (!saved?.dataBase64) {
    throw new Error("Media file write verification failed. Check MongoDB connection and document size limits.");
  }

  return {
    id: input.id,
    url: `/api/media/file/${input.id}`,
    bytes: input.buffer.length,
    contentType: input.contentType || "application/octet-stream",
  };
}

export async function getMediaFile(id: string) {
  if (!(await connectMongo())) return null;
  // Avoid lean() for legacy Buffer docs; still fine for base64 strings.
  return MediaFileModel().findOne({ id }).exec();
}

export async function getMediaFileBytes(id: string): Promise<{
  bytes: Buffer;
  contentType: string;
  filename: string;
} | null> {
  const file = await getMediaFile(id);
  if (!file) return null;

  const fromBase64 = file.dataBase64 ? toNodeBuffer(file.dataBase64) : null;
  const fromBinary = toNodeBuffer(file.data);
  const bytes = fromBase64 ?? fromBinary;
  if (!bytes?.length) return null;

  return {
    bytes,
    contentType: file.contentType || "application/octet-stream",
    filename: file.filename || id,
  };
}
