import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                -- Weekly Sales
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS cash_week,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS upi_week,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS debitcard_week,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS creditcard_week,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS others_week,

                -- Monthly Sales
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS cash_month,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS upi_month,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS debitcard_month,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS creditcard_month,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS others_month,

                -- Yearly Sales
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS cash_year,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS upi_year,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS debitcard_year,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS creditcard_year,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS others_year
            FROM invoices
        `);

        return NextResponse.json(rows.length > 0 ? rows[0] : {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sales data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
