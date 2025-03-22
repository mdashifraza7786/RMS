import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";  

export async function GET() {
    const connection = await dbConnect();

    try {
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; 

        // Get today's attendance records
        const [records] = await connection.query<RowDataPacket[]>(
            `SELECT 
                userid, name, role, status, date, time,
                (SELECT MIN(date) FROM attendance) AS minDate,
                (SELECT MAX(date) FROM attendance) AS maxDate
            FROM attendance
            WHERE date = ?`,
            [date]
        );

        // Get all distinct dates for which attendance exists
        const [dateRecords] = await connection.query<RowDataPacket[]>(
            `SELECT DISTINCT date FROM attendance ORDER BY date`
        );
        
        const availableDates = dateRecords.map((record: any) => {
            // Format the date as YYYY-MM-DD
            return new Date(record.date).toISOString().split('T')[0];
        });

        // Extract minDate and maxDate from the first record
        const minDate = records.length > 0 ? records[0].minDate : null;
        const maxDate = date; // Today's date is the max date

        return NextResponse.json({
            message: 'Attendance Fetched Successfully',
            data: records,
            minDate,
            maxDate,
            availableDates
        });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        return NextResponse.json({ message: 'Failed to fetch attendance records' }, { status: 500 });
    } finally {
        connection.end();
    }
}
