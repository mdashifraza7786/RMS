import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";  

export async function GET() {
    const connection = await dbConnect();

    try {
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; 

        const [existingRecords] = await connection.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM attendance WHERE date = ?',
            [date]
        );

        if (existingRecords[0].count === 0) {
            const [users] = await connection.query<RowDataPacket[]>('SELECT userid, name, role FROM user');

            for (const user of users) {
                const { userid, name, role } = user;
                await connection.query(
                    'INSERT INTO attendance (userid, name, role, status, date, time) VALUES (?, ?, ?, "absent", ?, NULL)',
                    [userid, name, role, date]
                );                
            }
        } else {
            return NextResponse.json({ message: 'Already generated for today' }, { status: 209 });
        }

        // Retrieve and return all attendance records
        const [rows1] = await connection.query<RowDataPacket[]>('SELECT userid, name, role, status, date, time FROM attendance');
        return NextResponse.json({ message: 'Attendance Generated Successfully', data: rows1 });
    } catch (error) {
        console.error('Error inserting attendance records:', error);
        return NextResponse.json({ message: 'Failed to insert attendance records' ,data:error}, { status: 500 });
    } finally {
        connection.end();
    }
}
