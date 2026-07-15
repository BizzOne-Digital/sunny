import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectMongo, Models } from "@/lib/site";

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  const { id, status, adminNotes } = await request.json();
  if (!id) return NextResponse.json({ error: "Booking id is required." }, { status: 400 });

  await Models.Booking().findByIdAndUpdate(id, {
    ...(status ? { status } : {}),
    ...(adminNotes ? { adminNotes } : {}),
  });

  return NextResponse.json({ ok: true });
}
