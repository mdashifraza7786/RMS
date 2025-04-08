import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/database/database";

export async function DELETE(request: NextRequest) {
    const connection = await dbConnect();
    const { id } = await request.json(); // Corrected to use `id` for the `expenses` table

    try {
        // Start transaction
        await connection.beginTransaction();

        // Delete from expenses table
        await connection.query(
            `DELETE FROM expenses
             WHERE id = ?`,
            [id]
        );

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success: true, message: "Expense deleted successfully!" });
    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error("Error deleting expense:", error.message);
        return NextResponse.json({ success: false, message: "Error deleting expense", details: error.message });
    } finally {
        await connection.end();
    }
}
