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
    // Accept both 'id' and 'userid' for backward compatibility with frontend
    const payoutId = data.id ?? data.userid;
    const { status } = data;
    
    if (!payoutId || !status) {
        return NextResponse.json(errorResponse("Missing id/userid or status"), { status: 400 });
    }

    const result = await payPayout(Number(payoutId), status);
    if (!result.success) {
        return NextResponse.json(errorResponse(result.message || "Update failed"), { status: 500 });
    }
    
    return NextResponse.json(successResponse(null, result.message));
});
