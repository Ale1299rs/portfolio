import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

function setNestedProperty(obj: any, keyPath: string, value: string) {
  const keys = keyPath.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locale, namespace, keyPath, value } = body;

    if (!locale || !namespace || !keyPath || value === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In produzione (Vercel) il filesystem è read-only: salviamo su Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from("translation_overrides")
        .upsert(
          { locale, namespace, key_path: keyPath, value, updated_at: new Date().toISOString() },
          { onConflict: "locale,namespace,key_path" }
        );
      if (error) {
        console.error("Supabase upsert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Salvato su Supabase." });
    }

    // Fallback per sviluppo locale: scrivi direttamente sul file JSON
    const filePath = path.join(process.cwd(), "messages", `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Translation file not found" }, { status: 404 });
    }
    const fileData = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileData);
    setNestedProperty(json, `${namespace}.${keyPath}`, value);
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Salvato in locale." });
  } catch (error: any) {
    console.error("Error updating translation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
