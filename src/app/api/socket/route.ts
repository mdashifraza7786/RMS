import { NextResponse } from "next/server";

export async function GET() {
  const WebSocket = require("ws");
  const ws = new WebSocket("ws://localhost:3001");

  ws.on("open", () => {
    console.log("✅ WebSocket connected from API route!");
    ws.send("Hello from Next.js API route 🚀");

  });

  ws.on("error", (err: any) => {
    console.error("❌ WebSocket error:", err);
  });

  return NextResponse.json({ message: "✅ WebSocket message sent!" });
}
