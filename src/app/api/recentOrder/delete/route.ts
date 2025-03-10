import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/database/database";

export async function DELETE(request: NextRequest) {
        const connection = await dbConnect();
        const { order_id} = await request.json();
    
        try {
            // Start transaction
            await connection.beginTransaction();

            await connection.query(
                `DELETE FROM recent_inventory_order
                 WHERE order_id = ?`,
                [order_id]
            );
    
            // Commit transaction
            await connection.commit();
    
            return NextResponse.json({ success: true, message: 'recent order deleted successfully' });
    
        } catch (error: any) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error('Error deleting recent order:', error.message);
            return NextResponse.json({ success: false, message: 'Error deleting recent order' });
        } finally {
            await connection.end();
        }
    }
    