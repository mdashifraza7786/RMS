import { getPayout } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getPayout(page, limit);

    if (!result.success) {
        return NextResponse.json(errorResponse(result.message || "Failed to fetch payout"), { status: 500 });
    }

    return NextResponse.json(successResponse(result.data));
});
