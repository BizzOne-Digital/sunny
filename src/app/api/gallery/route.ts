import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Gallery from "@/models/Gallery";
import { requireAuth } from "@/lib/auth";

// GET all gallery images (public)
export async function GET() {
  try {
    await connectDB();
    const images = await Gallery.find({ status: "published" }).sort({ order: 1 });
    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("Get gallery images error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new gallery image (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const body = await request.json();
    const image = await Gallery.create(body);

    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create gallery image error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
