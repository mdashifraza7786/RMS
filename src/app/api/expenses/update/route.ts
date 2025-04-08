import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/database/database";

export async function PUT(request: NextRequest) {
    const connection = await dbConnect();
    const { id, expenses_for, frequency, cost, date } = await request.json();

    try {
        // Start transaction
        await connection.beginTransaction();

        // Update the expenses table
        await connection.query(
            `UPDATE expenses 
             SET expenses_for = ?, frequency = ?, cost = ?, date = ? 
             WHERE id = ?`,
            [expenses_for, frequency, cost, date, id]
        );

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success: true, message: "Expense updated successfully!" });
    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error("Error updating expense:", error.message);
        return NextResponse.json({ success: false, message: "Error updating expense", details: error.message });
    } finally {
        await connection.end();
    }
}
