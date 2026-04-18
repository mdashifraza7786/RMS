import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";  
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get('userid') || undefined;
    const role = searchParams.get('role') || undefined;
    const connection = await dbConnect();

    try {
        const urlDate = searchParams.get('date');
        const fetchDate = urlDate || new Date().toISOString().split('T')[0]; 

        const [[{ minDate, maxDate }]] = await connection.query<RowDataPacket[]>(
            `SELECT MIN(date) as minDate, MAX(date) as maxDate FROM attendance`
        );

        let records: any;
        if(role === 'waiter' || role === 'chef'){
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT userid, name, role, status, date, time
                 FROM attendance
                 WHERE date = ? AND userid = ?`,
                [fetchDate, userid]
            );
            records = rows;
        }else{
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT userid, name, role, status, date, time
                 FROM attendance
                 WHERE date = ?`,
                [fetchDate]
            );
            records = rows;
        }

        const [dateRecords] = await connection.query<RowDataPacket[]>(
            `SELECT DISTINCT date FROM attendance ORDER BY date`
        );
        
        const availableDates = dateRecords.map((record: any) => {
            return record.date ? new Date(record.date).toISOString().split('T')[0] : null;
        }).filter(Boolean);

        const responseMaxDate = maxDate ? new Date(maxDate).toISOString().split('T')[0] : fetchDate;
        const responseMinDate = minDate ? new Date(minDate).toISOString().split('T')[0] : null;

        return NextResponse.json(successResponse({
            records,
            minDate: responseMinDate,
            maxDate: responseMaxDate,
            availableDates
        }, 'Attendance Fetched Successfully'));
    } finally {
        connection.release();
    }
});
