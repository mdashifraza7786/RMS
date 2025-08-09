import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";  

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get('userid') || undefined;
    const role = searchParams.get('role') || undefined;
    const connection = await dbConnect();

    try {
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; 

        let records: any;
        if(role === 'waiter' || role === 'chef'){
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT 
                    userid, name, role, status, date, time,
                (SELECT MIN(date) FROM attendance) AS minDate,
                (SELECT MAX(date) FROM attendance) AS maxDate
            FROM attendance
                WHERE date = ? AND userid = ?`,
                [date, userid]
            );
            records = rows;
        }else{
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT 
                    userid, name, role, status, date, time,
                    (SELECT MIN(date) FROM attendance) AS minDate,
                    (SELECT MAX(date) FROM attendance) AS maxDate
                FROM attendance
                WHERE date = ?`,
                [date]
            );
            records = rows;
        }

        const [dateRecords] = await connection.query<RowDataPacket[]>(
            `SELECT DISTINCT date FROM attendance ORDER BY date`
        );
        
        const availableDates = dateRecords.map((record: any) => {
            return new Date(record.date).toISOString().split('T')[0];
        });

        const minDate = Array.isArray(records) && records.length > 0 ? (records[0] as any).minDate : null;
        const maxDate = date;

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
