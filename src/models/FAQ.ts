import mongoose, { Schema, Model } from "mongoose";

export interface IFAQ {
  slug: string;
  question: string;
  answer: string;
  category: string;
  serviceSlug?: string;
  status: "published" | "draft";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    serviceSlug: String,
    status: {
      type: String,
      default: "published",
      enum: ["published", "draft"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const FAQ: Model<IFAQ> =
  mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", faqSchema);

export default FAQ;
