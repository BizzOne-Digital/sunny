import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectMongo, Models } from "@/lib/site";

const cookieName = "dtdogs_admin";

export type AdminSession = {
  email: string;
  role: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(session: AdminSession) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required.");
  return jwt.sign(session, secret, { expiresIn: "8h" });
}

export function verifyAdminToken(token?: string): AdminSession | null {
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    return jwt.verify(token, process.env.AUTH_SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  return verifyAdminToken(store.get(cookieName)?.value);
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(cookieName);
}

export async function ensureFirstAdmin() {
  await connectMongo();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const AdminUser = Models.AdminUser();
  const existing = await AdminUser.findOne({ email });
  if (!existing) {
    await AdminUser.create({
      email,
      passwordHash: await hashPassword(password),
      role: "Owner/Admin",
    });
  }
}
