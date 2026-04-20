import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { isEditablePath, loadFile, saveFile } from "@/lib/admin-github";

export const runtime = "edge";

async function requireSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!(await requireSession(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const path = req.nextUrl.searchParams.get("path") ?? "";
  if (!isEditablePath(path)) {
    return NextResponse.json({ error: "Path not editable" }, { status: 400 });
  }
  const result = await loadFile(path);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  if (!(await requireSession(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { path?: string; content?: string; sha?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (
    typeof body.path !== "string" ||
    typeof body.content !== "string" ||
    typeof body.sha !== "string"
  ) {
    return NextResponse.json(
      { error: "path, content, sha are required" },
      { status: 400 },
    );
  }
  if (!isEditablePath(body.path)) {
    return NextResponse.json({ error: "Path not editable" }, { status: 400 });
  }
  if (body.path.endsWith(".json")) {
    try {
      JSON.parse(body.content);
    } catch (e) {
      return NextResponse.json(
        { error: `Invalid JSON: ${(e as Error).message}` },
        { status: 400 },
      );
    }
  }
  const message = `admin: update ${body.path}`;
  const result = await saveFile(body.path, body.content, body.sha, message);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, sha: result.sha });
}
