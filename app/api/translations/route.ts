import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Tipo ricorsivo per aggiornare le proprietà annidate
function setNestedProperty(obj: any, keyPath: string, value: string) {
  const keys = keyPath.split(".");
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
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

    // Costruiamo il percorso verso il file locale (es: /messages/it.json)
    const filePath = path.join(process.cwd(), "messages", `${locale}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Translation file not found" }, { status: 404 });
    }

    // Leggiamo e parsiamo il file
    const fileData = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileData);

    // Aggiorniamo la proprietà
    // namespace è es. 'hero', keyPath è 'titleAccent' => costrutto completo 'hero.titleAccent'
    const fullPath = `${namespace}.${keyPath}`;
    setNestedProperty(json, fullPath, value);

    // Scriviamo di nuovo il file con formattazione a 2 spazi
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Translation updated locally." });
  } catch (error: any) {
    console.error("Error updating translation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
