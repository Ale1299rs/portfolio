// Persona + system prompt for the "Chat with Alex" assistant.
// The content lives in content/chatbot.json so it can be edited via Decap.
// The DeepSeek API key is NEVER exposed here — only the prompt shape is.

import data from "@/content/chatbot.json";

export function buildSystemPrompt(locale: string): string {
  const sections = [
    data.identity,
    data.whoYouAre,
    data.caseStudies,
    data.opinions,
    data.offWork,
    data.style,
    data.redLines,
    locale === "it" ? data.langHintIt : data.langHintEn,
  ];
  return sections.join("\n\n");
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
