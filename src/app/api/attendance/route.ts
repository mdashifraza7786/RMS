import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";  

export async function GET() {
    const connection = await dbConnect();

    try {
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; 

        const [records] = await connection.query<RowDataPacket[]>(
            `SELECT 
                userid, name, role, status, date, time,
                (SELECT MIN(date) FROM attendance) AS minDate,
                (SELECT MAX(date) FROM attendance) AS maxDate
            FROM attendance
            WHERE date = ?`,
            [date]
        );

        // Extract minDate and maxDate from the first record
        const minDate = records.length > 0 ? records[0].minDate : null;
        const maxDate = records.length > 0 ? records[0].maxDate : null;

        return NextResponse.json({
            message: 'Attendance Fetched Successfully',
            data: records,
            minDate,
            maxDate
        });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        return NextResponse.json({ message: 'Failed to fetch attendance records' }, { status: 500 });
    } finally {
        connection.end();
    }
}
