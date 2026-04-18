import { getStaffOrders, getTableOrders } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || undefined;
    const userid = searchParams.get('userid') || undefined;
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let result;
    if (role || userid) {
        result = await getStaffOrders(role, userid, page, limit, status, search);
    } else {
        result = await getTableOrders(page, limit, status, search);
    }
    
    if (!result.success) {
        throw new Error(result.message || "Failed to fetch orders");
    }

    return NextResponse.json(successResponse(result.data));
});