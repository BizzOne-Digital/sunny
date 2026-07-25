import mongoose, { Schema, Model } from "mongoose";

export interface IPageSection {
  sectionId: string;
  sectionType: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  images?: Array<{
    id: string;
    url: string;
    alt: string;
    title: string;
  }>;
  items?: Array<{
    title: string;
    body: string;
    icon?: string;
    image?: {
      id: string;
      url: string;
      alt: string;
    };
  }>;
  order: number;
}

export interface IPageContent {
  slug: string;
  pageTitle: string;
  seoTitle: string;
  metaDescription: string;
  sections: IPageSection[];
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

const pageSectionSchema = new Schema<IPageSection>(
  {
    sectionId: { type: String, required: true },
    sectionType: { type: String, required: true },
    eyebrow: String,
    heading: String,
    subheading: String,
    body: String,
    primaryCta: {
      label: String,
      href: String,
    },
    secondaryCta: {
      label: String,
      href: String,
    },
    images: [
      {
        id: String,
        url: String,
        alt: String,
        title: String,
      },
    ],
    items: [
      {
        title: String,
        body: String,
        icon: String,
        image: {
          id: String,
          url: String,
          alt: String,
        },
      },
    ],
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const pageContentSchema = new Schema<IPageContent>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pageTitle: {
      type: String,
      required: true,
    },
    seoTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    sections: [pageSectionSchema],
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

const PageContent: Model<IPageContent> =
  mongoose.models.PageContent || mongoose.model<IPageContent>("PageContent", pageContentSchema);

export default PageContent;
