import { NextRequest, NextResponse } from "next/server";
import {updateMenu} from "@/database/database";

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        // console.log(data.photo);
        await updateMenu(data);

        return NextResponse.json({ message: 'Menu updated successfuly' }, { status: 200 });
    } catch (error) {
        console.error('Error updating menu:', error);
        return NextResponse.json({ message: 'Error updating menu' }, { status: 500 });
    }
}
