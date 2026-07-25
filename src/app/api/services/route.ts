import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { requireAuth } from "@/lib/auth";

// GET all services (public)
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ status: "published" }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new service (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const body = await request.json();
    const service = await Service.create(body);

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
