import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/database";
import { auth } from "@/auth";
import { errorResponse } from "@/lib/api-response";

export async function DELETE(request: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
        return NextResponse.json(errorResponse("Unauthorized"), { status: 403 });
    }

    const connection = await dbConnect();
    const { item_id } = await request.json();

    try {
        await connection.beginTransaction();
        await connection.query(`DELETE FROM menu WHERE item_id = ?`, [item_id]);
        await connection.commit();
        return NextResponse.json({ success: true, message: 'Menu deleted successfully' });
    } catch (error: any) {
        await connection.rollback();
        console.error('Error deleting menu:', error.message);
        return NextResponse.json({ success: false, message: 'Error deleting menu' });
    } finally {
        await connection.release();
    }
}
