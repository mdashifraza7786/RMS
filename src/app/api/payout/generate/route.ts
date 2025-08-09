import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET() {
    const connection = await dbConnect();

    try {
        const now = new Date();
        const fmt = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthStartStr = fmt(monthStart);

        const [existingRecords] = await connection.query<RowDataPacket[]>(
            `SELECT COUNT(*) as count
             FROM payout
             WHERE DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')`,
            [monthStartStr]
        );

        if (existingRecords[0]?.count > 0) {
            return NextResponse.json({ message: 'Payout already generated for this month' }, { status: 209 });
        }

        await connection.beginTransaction();

        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // last day of previous month
        const prevMonthStartStr = fmt(prevMonthStart);
        const prevMonthEndStr = fmt(prevMonthEnd);

        // for reference: amount = (salary / 30) * total_attendance_in_previous_month + balance
        await connection.query(
          `INSERT INTO payout (userid, account_number, upi_id, amount, status, date)
           SELECT 
             pd.userid,
             pd.account_number,
             pd.upiid AS upi_id,
             ROUND(
               (
                 (COALESCE(CAST(pd.salary AS DECIMAL(12,2)), 0) / 30)
                 * COALESCE((
                     SELECT COUNT(*)
                     FROM attendance a
                     WHERE a.userid = pd.userid
                       AND DATE(COALESCE(STR_TO_DATE(a.date, '%Y-%m-%d'), a.date)) BETWEEN DATE(?) AND DATE(?)
                       AND LOWER(a.status) = 'present'
                 ), 0)
                 + COALESCE(CAST(pd.balance AS DECIMAL(12,2)), 0)
               ), 2
             ) AS amount,
             'pending' AS status,
             ? AS date
           FROM payout_details pd
           LEFT JOIN user u ON u.userid = pd.userid
           WHERE NOT EXISTS (
             SELECT 1 FROM payout p
             WHERE p.userid = pd.userid
               AND DATE_FORMAT(p.date, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
           )`,
           [prevMonthStartStr, prevMonthEndStr, monthStartStr, monthStartStr]
        );

        await connection.commit();

        const [rows1] = await connection.query<RowDataPacket[]>(
          `SELECT userid, account_number, upi_id, amount, status, date
           FROM payout
           WHERE DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
           ORDER BY userid ASC`,
          [monthStartStr]
        );
        return NextResponse.json({ message: 'Payout generated successfully', data: rows1 });
    } catch (error) {
        try { await connection.rollback(); } catch {}
        console.error('Error generating payout records:', error);
        return NextResponse.json({ message: 'Failed to generate payout records', data: error }, { status: 500 });
    } finally {
        connection.end();
    }
}
