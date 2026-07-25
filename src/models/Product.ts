import mongoose, { Schema, Model } from "mongoose";

export interface IProduct {
  slug: string;
  title: string;
  description: string;
  priceLabel: string;
  compareAtPriceLabel?: string;
  status: "published" | "draft" | "coming-soon";
  images: Array<{
    id: string;
    url: string;
    alt: string;
    title: string;
    order: number;
  }>;
  sizes: string[];
  colors: string[];
  inventory?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
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
    description: {
      type: String,
      required: true,
    },
    priceLabel: {
      type: String,
      required: true,
    },
    compareAtPriceLabel: String,
    status: {
      type: String,
      default: "coming-soon",
      enum: ["published", "draft", "coming-soon"],
    },
    images: [
      {
        id: String,
        url: String,
        alt: String,
        title: String,
        order: Number,
      },
    ],
    sizes: [String],
    colors: [String],
    inventory: Number,
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
