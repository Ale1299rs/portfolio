import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Missing GITHUB_CLIENT_ID env var", { status: 500 });
  }

  const redirectUri = `${req.nextUrl.origin}/api/auth/callback`;
  const state = crypto.randomUUID();

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "repo,user");
  url.searchParams.set("state", state);

  return NextResponse.redirect(url.toString());
}
