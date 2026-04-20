import { Editor } from "./client";
import fs from "fs";
import path from "path";

// Basic local persistence for Puck (useful during testing/development)
const getPageData = (puckPath: string) => {
  const sanitize = puckPath.replace(/[^a-zA-Z0-9-]/g, "") || "root";
  const filePath = path.join(process.cwd(), ".puck", `${sanitize}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return { content: [], root: {} };
};

export default async function PuckPage({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  const resolvedParams = await params;
  const path = resolvedParams.puckPath ? `/${resolvedParams.puckPath.join("/")}` : "/";
  const data = getPageData(path);

  return <Editor puckPath={path} initialData={data} />;
}
