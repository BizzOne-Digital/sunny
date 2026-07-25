import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/models/Team";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const team = await Team.find({ status: "published" }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();
    const teamMember = await Team.create(body);
    return NextResponse.json({ success: true, teamMember }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create team member error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
