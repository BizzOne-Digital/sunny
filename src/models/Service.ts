import mongoose, { Schema, Model } from "mongoose";

export interface IService {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  forWhom: string;
  benefits: string[];
  includes: string[];
  process: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  related: string[];
  images: Array<{
    id: string;
    url: string;
    alt: string;
    title: string;
  }>;
  featured: boolean;
  status: "published" | "draft" | "coming-soon";
  priceLabel?: string;
  duration?: string;
  priceTiers?: Array<{
    label: string;
    priceLabel: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    eyebrow: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    forWhom: {
      type: String,
      required: true,
    },
    benefits: [String],
    includes: [String],
    process: [String],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    related: [String],
    images: [
      {
        id: String,
        url: String,
        alt: String,
        title: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "published",
      enum: ["published", "draft", "coming-soon"],
    },
    priceLabel: String,
    duration: String,
    priceTiers: [
      {
        label: String,
        priceLabel: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema);

export default Service;
