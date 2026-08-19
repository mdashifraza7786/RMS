import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { auth } from "@/auth";

/** Convert a Date (or date-like string from MySQL) to a local YYYY-MM-DD string. */
const localDateStr = (d: Date | string | null | undefined): string | null => {
    if (!d) return null;
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return String(d).slice(0, 10);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

export const GET = withErrorHandling(async (request: Request) => {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionRole = (session.user as any)?.role as string | undefined;
    const sessionUserid = (session.user as any)?.userid as string | undefined;
    const isAdmin = sessionRole === "admin";

    const { searchParams } = new URL(request.url);
    const requestedUserid = searchParams.get("userid") || undefined;
    if (!isAdmin && requestedUserid && requestedUserid !== sessionUserid) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const targetUserid = isAdmin ? requestedUserid : sessionUserid;
    const connection = await dbConnect();

    try {
        const urlDate   = searchParams.get('date');
        const fetchDate = urlDate || localDateStr(new Date())!;

        const [[{ minDate, maxDate }]] = await connection.query<RowDataPacket[]>(
            `SELECT MIN(date) as minDate, MAX(date) as maxDate FROM attendance`
        );

        let records: any;
        if (targetUserid) {
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT userid, name, role, status,
                        DATE_FORMAT(date, '%Y-%m-%d') as date, time
                 FROM attendance
                 WHERE date = ? AND userid = ?`,
                [fetchDate, targetUserid]
            );
            records = rows;
        } else {
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT userid, name, role, status,
                        DATE_FORMAT(date, '%Y-%m-%d') as date, time
                 FROM attendance
                 WHERE date = ?`,
                [fetchDate]
            );
            records = rows;
        }

        const [dateRecords] = await connection.query<RowDataPacket[]>(
            `SELECT DATE_FORMAT(date, '%Y-%m-%d') as date FROM attendance GROUP BY date ORDER BY date`
        );

        const availableDates = dateRecords
            .map((r: any) => r.date as string)
            .filter(Boolean);

        return NextResponse.json(successResponse({
            records,
            minDate: localDateStr(minDate),
            maxDate: localDateStr(maxDate) ?? fetchDate,
            availableDates,
        }, 'Attendance Fetched Successfully'));
    } finally {
        connection.release();
    }
});
