import mongoose, { Schema, Model } from "mongoose";

export interface IGallery {
  id: string;
  title: string;
  alt: string;
  caption?: string;
  url: string;
  width?: number;
  height?: number;
  tags?: string[];
  status: "published" | "hidden" | "draft";
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    caption: String,
    url: {
      type: String,
      required: true,
    },
    width: Number,
    height: Number,
    tags: [String],
    status: {
      type: String,
      default: "published",
      enum: ["published", "hidden", "draft"],
    },
    order: Number,
  },
  {
    timestamps: true,
  }
);

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", gallerySchema);

export default Gallery;
