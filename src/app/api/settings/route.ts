import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, getSettingsByType } from "@/database";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const session = await auth();
  const type = request.nextUrl.searchParams.get("type");
  const isThemeRequest = type === "theme";
  
  // Check if user is authenticated, unless it's a theme request
  if (!isThemeRequest && (!session || !session.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const isAdmin = session?.user?.role === "admin";
  
  if (type) {
    const result = await getSettingsByType(type);
    
    if (!isThemeRequest && !isAdmin && (type === "general" || type === "staff")) {
      return NextResponse.json({ error: "Unauthorized to access these settings" }, { status: 403 });
    }
    
    return NextResponse.json(successResponse(result.data));
  } else {
    // If all settings are requested (admin only)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized to access all settings" }, { status: 403 });
    }
    
    const result = await getAllSettings();
    return NextResponse.json(successResponse(result.data));
  }
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
  }

  const { updateSetting } = await import("@/database/settings");
  const result = await updateSetting(key, String(value));
  
  if (!result.success) {
    throw new Error(result.message);
  }

  return NextResponse.json(successResponse({ success: true }));
});
