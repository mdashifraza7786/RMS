import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";  

export async function POST(request:Request) {
    const {byDate} = await request.json();
    const connection = await dbConnect();

    try {
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; 

        const [records] = await connection.query<RowDataPacket[]>(
            'SELECT userid,name,role,status,date,time FROM attendance WHERE date = ?',
            [byDate]
        );

        
        return NextResponse.json({ message: 'Attendance Generated Successfully', data: records });
    } catch (error) {
        console.error('Error inserting attendance records:', error);
        return NextResponse.json({ message: 'Failed to insert attendance records'}, { status: 500 });
    } finally {
        connection.end();
    }
}
