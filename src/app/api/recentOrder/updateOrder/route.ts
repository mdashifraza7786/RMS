import { NextRequest, NextResponse } from "next/server";
import { updateRecentOrders } from "@/database/database";

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        const result = await updateRecentOrders(data);

        if (result) {
            return NextResponse.json({ message: 'Recent order updated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to update recent order' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating recent order:', error);
        return NextResponse.json({ message: 'Error updating recent order' }, { status: 500 });
    }
}
