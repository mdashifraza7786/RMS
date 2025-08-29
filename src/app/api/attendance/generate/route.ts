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
 
            if (users.length > 0) {
                const values = users.map(u => [u.userid, u.name, u.role, null, date, null]);
 
                await connection.query(
                    'INSERT INTO attendance (userid, name, role, status, date, time) VALUES ?',
                    [values]
                );
            }
        } else {
            return NextResponse.json({ message: 'Already generated for today' }, { status: 209 });
        }
 
        const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT userid, name, role, status, date, time FROM attendance WHERE date = ?',
            [date]
        );
 
        return NextResponse.json({ message: 'Attendance Generated Successfully', data: rows });
    } catch (error) {
        console.error('Error inserting attendance records:', error);
        return NextResponse.json({ message: 'Failed to insert attendance records', data: error }, { status: 500 });
    } finally {
        connection.end();
    }
}
 