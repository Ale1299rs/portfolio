import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { path: puckPath, data } = await req.json();
    const sanitize = puckPath.replace(/[^a-zA-Z0-9-]/g, "") || "root";
    
    // Ensure directory exists
    const dir = path.join(process.cwd(), ".puck");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${sanitize}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
