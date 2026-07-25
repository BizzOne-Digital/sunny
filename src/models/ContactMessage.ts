import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  status: "New" | "Read" | "Replied" | "Archived";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
    },
    email: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true,
    },
    message: { 
      type: String, 
      required: true,
    },
    status: { 
      type: String, 
      enum: ["New", "Read", "Replied", "Archived"], 
      default: "New",
    },
    adminNotes: { 
      type: String,
    },
  },
  { 
    timestamps: true,
  }
);

// Index for faster queries
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ status: 1 });
ContactMessageSchema.index({ email: 1 });

export default mongoose.models.ContactMessage || 
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
