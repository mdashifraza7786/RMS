import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, getSettingsByType } from "@/database/database";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only admin can access all settings
    const isAdmin = session.user.role === "admin";
    
    // Get type from query params
    const type = request.nextUrl.searchParams.get("type");
    
    if (type) {
      // If specific type is requested
      const settings = await getSettingsByType(type);
      
      // If not admin, filter out sensitive settings
      if (!isAdmin && (type === "general" || type === "staff")) {
        return NextResponse.json({ error: "Unauthorized to access these settings" }, { status: 403 });
      }
      
      return NextResponse.json(settings);
    } else {
      // If all settings are requested (admin only)
      if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized to access all settings" }, { status: 403 });
      }
      
      const allSettings = await getAllSettings();
      return NextResponse.json(allSettings);
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
