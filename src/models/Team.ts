import mongoose, { Schema, Model } from "mongoose";

export interface ITeam {
  slug: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  image: {
    id: string;
    url: string;
    alt: string;
    title: string;
  };
  instagram?: string;
  facebook?: string;
  website?: string;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
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
    role: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    credentials: [String],
    image: {
      id: String,
      url: String,
      alt: String,
      title: String,
    },
    instagram: String,
    facebook: String,
    website: String,
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

const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>("Team", teamSchema);

export default Team;
