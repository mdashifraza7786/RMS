import { getInvoice } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const orderIdStr = searchParams.get("orderId");
    const orderId = orderIdStr ? parseInt(orderIdStr) : undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getInvoice(page, limit, orderId);

    if (!result.success) {
        return NextResponse.json(errorResponse(result.message || "Failed to fetch invoice"), { status: 500 });
    }

    return NextResponse.json(successResponse(result.data));
});
