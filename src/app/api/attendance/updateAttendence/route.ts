import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";  

export async function POST(request: Request) {
    const { userid, status, date } = await request.json();
    const connection = await dbConnect();
    
    const time = status === "absent" ? null : getCurrentTime();

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE attendance SET status = ?, time = ? WHERE userid = ? AND date = ?',
            [status, time, userid, date]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'No record found to update' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Attendance Updated Successfully' });
    } catch (error) {
        console.error('Error updating attendance record:', error);
        return NextResponse.json({ message: 'Failed to update attendance record' }, { status: 500 });
    } finally {
        connection.end();
    }
}

function getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`; 
}
