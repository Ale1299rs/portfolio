// Persona + system prompt for the "Chat with Alex" assistant.
// Content lives in content/chatbot.json so it can be edited via Decap.
// The DeepSeek API key is NEVER exposed here — only the prompt shape is.

import data from "@/content/chatbot.json";

const LANG_HINT_IT =
  "Il visitatore sta leggendo il sito in italiano. Rispondi in italiano con il solito mix naturale (i termini tecnici restano in inglese).";
const LANG_HINT_EN =
  "The visitor is reading the site in English. Reply primarily in English, keeping the natural IT/EN mix a consultant in Italy would use (technical terms stay in English anyway).";

export function buildSystemPrompt(locale: string): string {
  const sections = [
    data.identity,
    data.whoYouAre,
    data.approach,
    data.stakeholders,
    data.powerbi,
    data.tradeoffs,
    data.tooling,
    data.direction,
    data.style,
    data.redLines,
    data.projects,
    data.articles,
    `## Lingua / Language\n${locale === "it" ? LANG_HINT_IT : LANG_HINT_EN}`,
  ];
  return sections.join("\n\n");
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
