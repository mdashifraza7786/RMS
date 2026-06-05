import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
    const { byDate, ...rest } = await request.json();
    let userid: string | undefined, role: string | undefined;
    if ('userid' in rest && 'role' in rest) {
        userid = rest.userid;
        role   = rest.role;
    }
    const connection = await dbConnect();

    try {
        let records: any;
        const sql = `SELECT userid, name, role, status,
                            DATE_FORMAT(date, '%Y-%m-%d') as date, time
                     FROM attendance WHERE date = ?`;

        if (role === 'waiter' || role === 'chef') {
            [records] = await connection.query<RowDataPacket[]>(`${sql} AND userid = ?`, [byDate, userid]);
        } else {
            [records] = await connection.query<RowDataPacket[]>(sql, [byDate]);
        }

        return NextResponse.json({
            message: records.length > 0 ? 'Attendance fetched' : 'No attendance found',
            data: records,
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return NextResponse.json({ message: 'Failed to fetch attendance records' }, { status: 500 });
    } finally {
        connection.release();
    }
}
