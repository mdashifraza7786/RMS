import { NextRequest, NextResponse } from "next/server";
import {updateKitchenOrders} from "@/database/database";

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        await updateKitchenOrders(data);

        return NextResponse.json({ message: 'KitchenOrders updated successfuly' }, { status: 200 });
    } catch (error) {
        console.error('Error updating KitchenOrders:', error);
        return NextResponse.json({ message: 'Error updating KitchenOrders' }, { status: 500 });
    }
}
