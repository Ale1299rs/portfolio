import { type NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, type ChatMessage } from "@/lib/chatbot";
import { getSupabase, hashIp } from "@/lib/supabase";

export const runtime = "edge";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 2000;
const SESSION_COOKIE = "chat_sid";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Body = {
  messages?: ChatMessage[];
  locale?: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured on this deployment." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "messages array is required" },
      { status: 400 },
    );
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json(
      { error: `Too many messages (max ${MAX_MESSAGES}).` },
      { status: 400 },
    );
  }

  const clean: ChatMessage[] = [];
  for (const m of messages) {
    if (!m || typeof m.content !== "string") continue;
    if (m.role !== "user" && m.role !== "assistant") continue;
    clean.push({
      role: m.role,
      content: m.content.slice(0, MAX_CHARS_PER_MESSAGE),
    });
  }
  if (clean.length === 0) {
    return NextResponse.json(
      { error: "No valid messages" },
      { status: 400 },
    );
  }

  const locale = body.locale === "it" ? "it" : "en";
  const system = buildSystemPrompt(locale);

  let upstream: Response;
  try {
    upstream = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.7,
        max_tokens: 220,
        messages: [{ role: "system", content: system }, ...clean],
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Upstream request failed" },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: "Upstream error", detail: text.slice(0, 500) },
      { status: upstream.status },
    );
  }

  const data = (await upstream.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const reply = data.choices?.[0]?.message?.content?.trim() ?? "";

  const { sessionId, isNew } = await persistInteraction({
    req,
    locale,
    clean,
    reply,
  });

  const response = NextResponse.json({ reply });
  if (isNew && sessionId) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }
  return response;
}

async function persistInteraction(args: {
  req: NextRequest;
  locale: string;
  clean: ChatMessage[];
  reply: string;
}): Promise<{ sessionId: string | null; isNew: boolean }> {
  const supabase = getSupabase();
  if (!supabase) return { sessionId: null, isNew: false };

  try {
    const existing = args.req.cookies.get(SESSION_COOKIE)?.value;
    let sessionId: string | null =
      existing && UUID_REGEX.test(existing) ? existing : null;
    let isNew = false;

    if (!sessionId) {
      const ip =
        args.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        args.req.headers.get("x-real-ip") ??
        "";
      const ua = args.req.headers.get("user-agent") ?? "";
      const ipHash = ip ? await hashIp(ip) : null;

      const { data: inserted, error } = await supabase
        .from("chat_sessions")
        .insert({
          locale: args.locale,
          user_agent: ua.slice(0, 500),
          ip_hash: ipHash,
        })
        .select("id")
        .single();
      if (error || !inserted) return { sessionId: null, isNew: false };
      sessionId = inserted.id as string;
      isNew = true;
    }

    const lastUser = [...args.clean].reverse().find((m) => m.role === "user");
    const rows: Array<{ session_id: string; role: string; content: string }> =
      [];
    if (lastUser) {
      rows.push({
        session_id: sessionId,
        role: "user",
        content: lastUser.content,
      });
    }
    if (args.reply) {
      rows.push({
        session_id: sessionId,
        role: "assistant",
        content: args.reply,
      });
    }
    if (rows.length > 0) {
      await supabase.from("chat_messages").insert(rows);
    }

    return { sessionId, isNew };
  } catch {
    return { sessionId: null, isNew: false };
  }
}
