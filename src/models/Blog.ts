import mongoose, { Schema, Model } from "mongoose";

export interface IBlog {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  body: string;
  featuredImage: {
    id: string;
    url: string;
    alt: string;
    title: string;
  };
  inlineImages: Array<{
    id: string;
    url: string;
    alt: string;
    title: string;
  }>;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    featuredImage: {
      id: String,
      url: String,
      alt: String,
      title: String,
    },
    inlineImages: [
      {
        id: String,
        url: String,
        alt: String,
        title: String,
      },
    ],
    status: {
      type: String,
      default: "published",
      enum: ["published", "draft"],
    },
  },
  {
    timestamps: true,
  }
);

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
