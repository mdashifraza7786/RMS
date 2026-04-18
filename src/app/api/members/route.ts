import { getMembers } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const result = await getMembers(page, limit, search);
    
    if (!result.success) {
        throw new Error(result.message || "Failed to fetch members");
    }

    return NextResponse.json(successResponse(result.data));
});
