import { NextRequest, NextResponse } from "next/server";
import {updateInventory} from "@/database/database";

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        await updateInventory(data);

        return NextResponse.json({ message: 'Inventory updated successfuly' }, { status: 200 });
    } catch (error) {
        console.error('Error updating Inventory:', error);
        return NextResponse.json({ message: 'Error updating Inventory' }, { status: 500 });
    }
}
