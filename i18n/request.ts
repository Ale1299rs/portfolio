import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getSupabase } from "@/lib/supabase";

function setNestedProperty(obj: any, keyPath: string, value: string) {
  const keys = keyPath.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof current[keys[i]] !== "object" || current[keys[i]] === null) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;

  // Merge overrides saved in Supabase on top of the base JSON
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("translation_overrides")
        .select("namespace, key_path, value")
        .eq("locale", locale);

      if (data && data.length > 0) {
        for (const row of data) {
          setNestedProperty(messages, `${row.namespace}.${row.key_path}`, row.value);
        }
      }
    }
  } catch (e) {
    // Non bloccare il rendering se Supabase è irraggiungibile
    console.warn("Could not load translation overrides:", e);
  }

  return { locale, messages };
});

