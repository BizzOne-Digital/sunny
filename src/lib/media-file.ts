import mongoose, { Schema, type Model } from "mongoose";
import { connectMongo } from "@/lib/site";

export type StoredMediaFile = {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
};

const mediaFileSchema = new Schema<StoredMediaFile>(
  {
    id: { type: String, required: true, unique: true, index: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

function MediaFileModel() {
  return (
    (mongoose.models.MediaFile as Model<StoredMediaFile>) ||
    mongoose.model<StoredMediaFile>("MediaFile", mediaFileSchema)
  );
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

  await MediaFileModel().updateOne(
    { id: input.id },
    {
      $set: {
        id: input.id,
        filename: input.filename,
        contentType: input.contentType || "application/octet-stream",
        size: input.buffer.length,
        data: input.buffer,
      },
    },
    { upsert: true },
  );

  return {
    id: input.id,
    url: `/api/media/file/${input.id}`,
    bytes: input.buffer.length,
    contentType: input.contentType || "application/octet-stream",
  };
}

export async function getMediaFile(id: string) {
  if (!(await connectMongo())) return null;
  return MediaFileModel().findOne({ id }).lean();
}
