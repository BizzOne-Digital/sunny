import { NextResponse } from "next/server";
import { ensureFirstAdmin, setAdminCookie, signAdminToken, verifyPassword } from "@/lib/auth";
import { connectMongo, Models } from "@/lib/site";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (!(await connectMongo())) {
    return NextResponse.json({ error: "MONGODB_URI is required for admin login." }, { status: 500 });
  }

  await ensureFirstAdmin();

  const AdminUser = Models.AdminUser();
  const user = await AdminUser.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = signAdminToken({ email: user.email, role: user.role });
  await setAdminCookie(token);

  return NextResponse.json({ ok: true });
}
