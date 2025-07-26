import { getOrdersByStatus } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // Get the status from the query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    
    try {
        const orders = await getOrdersByStatus(status);
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
} 