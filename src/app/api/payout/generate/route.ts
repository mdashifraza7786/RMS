import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET() {
    const connection = await dbConnect();

    try {
        const now = new Date();
        // Allow generation any day, but scope idempotency by month
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthStartStr = monthStart.toISOString().split('T')[0];

        // Check if payouts for this month are already generated
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

        // Prepare previous month for attendance computation
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthStartStr = prevMonthStart.toISOString().split('T')[0];

        // Insert payout rows following schema: userid, account_number, upi_id, amount, status, date
        // amount = (salary / 30) * total_attendance_in_previous_month + balance
        await connection.query(
          `INSERT INTO payout (userid, account_number, upi_id, amount, status, date)
           SELECT 
             u.userid,
             pd.account_number,
             pd.upiid AS upi_id,
             (
               (COALESCE(CAST(pd.salary AS DECIMAL(12,2)), 0) / 30)
               * COALESCE((
                   SELECT COUNT(*)
                   FROM attendance a
                   WHERE a.userid = u.userid
                     AND DATE_FORMAT(STR_TO_DATE(a.date, '%Y-%m-%d'), '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
                     AND LOWER(a.status) = 'present'
               ), 0)
               + COALESCE(CAST(pd.balance AS DECIMAL(12,2)), 0)
             ) AS amount,
             'pending' AS status,
             ? AS date
           FROM user u
           LEFT JOIN payout_details pd ON pd.userid = u.userid
           WHERE NOT EXISTS (
             SELECT 1 FROM payout p
             WHERE p.userid = u.userid
               AND DATE_FORMAT(p.date, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
           )`,
          [prevMonthStartStr, monthStartStr, monthStartStr]
        );

        await connection.commit();

        // Retrieve and return all payout records for the month
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
