"use client";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "../../../puck.config";

export function Editor({ puckPath, initialData }: { puckPath: string, initialData: any }) {
  // Configured to save to our local API route (we'll create this next)
  const save = async (data: any) => {
    await fetch("/api/puck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: puckPath, data }),
    });
  };

  return (
    <Puck
      config={config}
      data={initialData}
      onPublish={save}
    />
  );
}
