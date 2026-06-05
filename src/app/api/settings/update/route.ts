import { NextResponse } from "next/server";
import { updateSetting, updateSettingsBatch } from "@/database";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const POST = withErrorHandling(async (request: Request) => {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    
    if (!session || userRole !== "admin") {
      return NextResponse.json(errorResponse("Unauthorized: Admins only"), { status: 403 });
    }
    
    const body = await request.json();
    
    if (body.key && body.value !== undefined) {
      const result = await updateSetting(body.key, body.value);
      return NextResponse.json(successResponse(result));
    }
    
    if (Array.isArray(body.settings)) {
      const result = await updateSettingsBatch(body.settings);
      return NextResponse.json(successResponse(result));
    }
    
    return NextResponse.json(errorResponse("Invalid request format"), { status: 400 });
});
