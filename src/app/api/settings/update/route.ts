import { NextRequest, NextResponse } from "next/server";
import { updateSetting, updateSettingsBatch } from "@/database/database";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Single setting update
    if (body.key && body.value !== undefined) {
      const result = await updateSetting(body.key, body.value);
      return NextResponse.json(result);
    }
    
    // Batch update
    if (Array.isArray(body.settings)) {
      const result = await updateSettingsBatch(body.settings);
      return NextResponse.json(result);
    }
    
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
