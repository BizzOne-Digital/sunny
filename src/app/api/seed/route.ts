import { NextResponse } from "next/server";
import { ensureFirstAdmin } from "@/lib/auth";
import { seedDatabase } from "@/lib/site";

export async function POST(request: Request) {
  const token = request.headers.get("x-seed-token");
  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return NextResponse.json({ error: "Invalid seed token." }, { status: 401 });
  }

  await seedDatabase();
  await ensureFirstAdmin();

  return NextResponse.json({ ok: true });
}
