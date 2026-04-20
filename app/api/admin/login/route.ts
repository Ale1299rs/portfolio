import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  getAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "edge";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const submitted = typeof body.password === "string" ? body.password : "";
  if (submitted !== getAdminPassword()) {
    await new Promise((r) => setTimeout(r, 300));
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
