import { getRecentInventoryOrders } from "@/database/inventory";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const result = await getRecentInventoryOrders(page, limit);

    return NextResponse.json(successResponse(result.data));
});
