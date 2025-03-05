import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/database/database";

export async function DELETE(request: NextRequest) {
        const connection = await dbConnect();
        const { item_id} = await request.json();
    
        try {
            // Start transaction
            await connection.beginTransaction();

            await connection.query(
                `DELETE FROM menu
                 WHERE item_id = ?`,
                [item_id]
            );
    
            // Commit transaction
            await connection.commit();
    
            return NextResponse.json({ success: true, message: 'Menu deleted successfully' });
    
        } catch (error: any) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error('Error deleting menu:', error.message);
            return NextResponse.json({ success: false, message: 'Error deleting menu' });
    
        } finally {
            await connection.end();
        }
    }
    