import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { auth } from "@/auth";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionRole = (session.user as any)?.role as string | undefined;
    const sessionUserid = (session.user as any)?.userid as string | undefined;
    const isAdmin = sessionRole === "admin";

    const { byDate, userid: requestedUserid } = await request.json();
    if (!isAdmin && requestedUserid && requestedUserid !== sessionUserid) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const targetUserid = isAdmin ? requestedUserid : sessionUserid;
    const connection = await dbConnect();

    try {
        let records: any;
        const sql = `SELECT userid, name, role, status,
                            DATE_FORMAT(date, '%Y-%m-%d') as date, time
                     FROM attendance WHERE date = ?`;

        if (targetUserid) {
            [records] = await connection.query<RowDataPacket[]>(`${sql} AND userid = ?`, [byDate, targetUserid]);
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
