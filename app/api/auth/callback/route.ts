import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function htmlResponse(script: string) {
  const body = `<!doctype html><html><head><meta charset="utf-8"><title>Authorizing…</title></head><body><script>${script}</script><p>Authorizing, you can close this window.</p></body></html>`;
  return new NextResponse(body, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function postMessageScript(
  status: "success" | "error",
  payload: Record<string, unknown>,
) {
  const payloadJson = JSON.stringify(payload);
  return `(function(){
  var message = 'authorization:github:${status}:' + ${JSON.stringify(payloadJson)};
  function receive(e){
    if (!e || !e.data) return;
    if (typeof e.data !== 'string') return;
    if (e.data !== 'authorizing:github') return;
    window.opener && window.opener.postMessage(message, e.origin);
    window.removeEventListener('message', receive, false);
    setTimeout(function(){ window.close(); }, 50);
  }
  window.addEventListener('message', receive, false);
  window.opener && window.opener.postMessage('authorizing:github', '*');
})();`;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return htmlResponse(
      postMessageScript("error", { message: "missing_oauth_credentials" }),
    );
  }
  if (!code) {
    return htmlResponse(postMessageScript("error", { message: "missing_code" }));
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
    cache: "no-store",
  });

  const data = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!data.access_token) {
    return htmlResponse(
      postMessageScript("error", {
        message: data.error_description || data.error || "no_token",
      }),
    );
  }

  return htmlResponse(
    postMessageScript("success", {
      token: data.access_token,
      provider: "github",
    }),
  );
}
