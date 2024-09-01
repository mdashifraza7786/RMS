import { NextRequest, NextResponse } from "next/server";
import { updateKitchenOrders } from "@/database/database";

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        const result = await updateKitchenOrders(data);

        if (result) {
            return NextResponse.json({ message: 'Kitchen order updated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to update kitchen order' }, { status: 400 });
        }
    } 
    catch (error) {
        console.error('Error updating kitchen orders:', error);
        return NextResponse.json({ message: 'Error updating kitchen orders' }, { status: 500 });
    }
}
