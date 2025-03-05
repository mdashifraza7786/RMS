import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/database/database";

export async function DELETE(request: NextRequest) {
        const connection = await dbConnect();
        const { item_id} = await request.json();
    
        try {
            // Start transaction
            await connection.beginTransaction();

            await connection.query(
                `DELETE FROM inventory
                 WHERE item_id = ?`,
                [item_id]
            );
    
            // Commit transaction
            await connection.commit();
    
            return NextResponse.json({ success: true, message: 'inventory item deleted successfully' });
    
        } catch (error: any) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error('Error deleting inventory item:', error.message);
            return NextResponse.json({ success: false, message: 'Error deleting inventory item' });
    
        } finally {
            await connection.end();
        }
    }
    