import mongoose, { Schema, Model } from "mongoose";

export interface ITestimonial {
  slug: string;
  reviewer: string;
  petName?: string;
  service: string;
  rating: number;
  quote: string;
  location?: string;
  image: {
    id: string;
    url: string;
    alt: string;
    title: string;
  };
  status: "published" | "draft";
  sample?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    reviewer: {
      type: String,
      required: true,
    },
    petName: String,
    service: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    quote: {
      type: String,
      required: true,
    },
    location: String,
    image: {
      id: String,
      url: String,
      alt: String,
      title: String,
    },
    status: {
      type: String,
      default: "published",
      enum: ["published", "draft"],
    },
    sample: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", testimonialSchema);

export default Testimonial;
