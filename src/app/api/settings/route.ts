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
