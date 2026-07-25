import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/models/Team";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const teamMember = await Team.findOne({ slug });
    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, teamMember });
  } catch (error) {
    console.error("Get team member error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
    const { slug } = await params;
    await connectDB();
    const body = await request.json();
    const teamMember = await Team.findOneAndUpdate({ slug }, body, { new: true, runValidators: true });
    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, teamMember });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update team member error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
    const { slug } = await params;
    await connectDB();
    const teamMember = await Team.findOneAndDelete({ slug });
    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Team member deleted" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete team member error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
