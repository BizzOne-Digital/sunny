import mongoose, { Schema, type Model } from "mongoose";

export const UPLOAD_FOLDERS = ["pages", "products", "gallery", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export type StoredUploadDoc = {
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt?: Date;
  updatedAt?: Date;
};

const storedUploadSchema = new Schema<StoredUploadDoc>(
  {
    folder: {
      type: String,
      required: true,
      enum: UPLOAD_FOLDERS,
      index: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true },
);

storedUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

function StoredUploadModel() {
  return (
    (mongoose.models.StoredUpload as Model<StoredUploadDoc>) ||
    mongoose.model<StoredUploadDoc>("StoredUpload", storedUploadSchema)
  );
}

export default StoredUploadModel;
