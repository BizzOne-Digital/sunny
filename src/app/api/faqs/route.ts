import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FAQ from "@/models/FAQ";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({ status: "published" }).sort({ category: 1, order: 1 });
    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error("Get FAQs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();
    const faq = await FAQ.create(body);
    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create FAQ error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
