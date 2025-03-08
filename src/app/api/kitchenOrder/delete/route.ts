import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/database/database";

export async function DELETE(request: NextRequest) {
        const connection = await dbConnect();
        const { order_id} = await request.json();
    
        try {
            // Start transaction
            await connection.beginTransaction();

            await connection.query(
                `DELETE FROM kitchen_order
                 WHERE order_id = ?`,
                [order_id]
            );
    
            // Commit transaction
            await connection.commit();
    
            return NextResponse.json({ success: true, message: 'kitchen order deleted successfully' });
    
        } catch (error: any) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error('Error deleting kitchen order:', error.message);
            return NextResponse.json({ success: false, message: 'Error deleting kitchen order' });
        } finally {
            await connection.end();
        }
    }
    