import { getOrdersByStatus } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || undefined;
    const userid = searchParams.get('userid') || undefined;
    try {
        const orders = await getOrdersByStatus(role, userid);
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
} 