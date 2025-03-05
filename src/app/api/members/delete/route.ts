import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/database/database";

export async function DELETE(request: NextRequest) {
        const connection = await dbConnect();
        const { userid} = await request.json();
    
        try {
            // Start transaction
            await connection.beginTransaction();

            await connection.query(
                `DELETE FROM user
                 WHERE userid = ?`,
                [userid]
            );

            await connection.query(
                `DELETE FROM payout_details
                 WHERE userid = ?`,
                [userid]
            );

            await connection.query(
                `DELETE FROM user_address
                 WHERE userid = ?`,
                [userid]
            );
    
            // Commit transaction
            await connection.commit();
    
            return NextResponse.json({ success: true, message: 'Member deleted successfully' });
    
        } catch (error: any) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error('Error deleting member:', error.message);
            return NextResponse.json({ success: false, message: 'Error deleting member' });
    
        } finally {
            await connection.end();
        }
    }
    