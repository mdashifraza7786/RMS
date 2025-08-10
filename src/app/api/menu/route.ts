import { getMenu } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getMenu();
  return NextResponse.json(data || { menu: [] });
}
