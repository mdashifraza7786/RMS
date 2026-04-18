import { getKitchenOrders } from "@/database/orders";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async () => {
    const order = await getKitchenOrders();

    return NextResponse.json(successResponse(order.data));
});
