import { NextResponse } from "next/server";
import { buildSystemPrompt, type ChatMessage } from "@/lib/chatbot";

export const runtime = "edge";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 2000;

type Body = {
  messages?: ChatMessage[];
  locale?: string;
};

export async function POST(req: Request) {
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
        max_tokens: 400,
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

  return NextResponse.json({ reply });
}
