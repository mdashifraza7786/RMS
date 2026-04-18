import { NextRequest, NextResponse } from "next/server";
import { payPayout } from "@/database"; 
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";
import { auth } from "@/auth";

export const POST = withErrorHandling(async (request: NextRequest) => {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    
    if (!session || userRole !== "admin") {
        return NextResponse.json(errorResponse("Forbidden: Admins only"), { status: 403 });
    }
   
    const data = await request.json();
    const { id, status } = data;
    
    if (!id || !status) {
        return NextResponse.json(errorResponse("Missing id or status"), { status: 400 });
    }

    const result = await payPayout(Number(id), status);
    if (!result.success) {
        return NextResponse.json(errorResponse(result.message || "Update failed"), { status: 500 });
    }
    
    return NextResponse.json(successResponse(null, result.message));
});
