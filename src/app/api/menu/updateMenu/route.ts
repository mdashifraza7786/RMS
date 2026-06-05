import { NextRequest, NextResponse } from "next/server";
import { dbConnect, updateMenu } from "@/database";
import { auth } from "@/auth";
import { errorResponse } from "@/lib/api-response";

export async function PUT(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
        return NextResponse.json(errorResponse("Unauthorized"), { status: 403 });
    }

    const connection = await dbConnect();
    const { item_id, item_description, item_name, item_foodtype, item_price, making_cost, item_thumbnail, item_type } = await request.json();

    try {
        await connection.beginTransaction();
        await connection.query(
            `UPDATE menu SET item_description = ?, item_name = ?, item_foodtype = ?, item_price = ?, making_cost = ?, item_thumbnail = ?, item_type = ? WHERE item_id = ?`,
            [item_description, item_name, item_foodtype, item_price, making_cost, item_thumbnail, item_type, item_id]
        );
        await connection.commit();
        return NextResponse.json({ success: true, message: 'Menu updated successfully' });
    } catch (error: any) {
        await connection.rollback();
        console.error('Error updating menu:', error.message);
        return NextResponse.json({ success: false, message: 'Error updating menu' });
    } finally {
        await connection.release();
    }
}
