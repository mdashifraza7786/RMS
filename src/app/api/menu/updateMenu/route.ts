import { NextRequest, NextResponse } from "next/server";
import {dbConnect, updateMenu} from "@/database/database";

export async function PUT(request: NextRequest) {
        const connection = await dbConnect();
        const { item_id, item_description, item_name, item_foodtype, item_price,making_cost, item_thumbnail, item_type } = await request.json();
    
        try {
            // Start transaction
            await connection.beginTransaction();

            await connection.query(
                `UPDATE menu SET item_description = ?, item_name = ?, item_foodtype = ?, item_price = ?,making_cost = ?, item_thumbnail = ?,item_type = ?
                 WHERE item_id = ?`,
                [item_description, item_name, item_foodtype, item_price,making_cost, item_thumbnail, item_type, item_id]
            );
    
            // Commit transaction
            await connection.commit();
    
            return NextResponse.json({ success: true, message: 'Menu updated successfully' });
    
        } catch (error: any) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error('Error updating menu:', error.message);
            return NextResponse.json({ success: false, message: 'Error updating menu' });
    
        } finally {
            await connection.end();
        }
    }
    