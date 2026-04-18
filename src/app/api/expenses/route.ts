import { getExpenses } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const result = await getExpenses(page, limit);
    if (!result.success) {
        throw new Error(result.message || "Failed to fetch expenses");
    }

    return NextResponse.json(successResponse(result.data));
});