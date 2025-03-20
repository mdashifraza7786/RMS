import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();
    
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS sales_week_breakfast,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS sales_week_lunch,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS sales_week_evening,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS sales_week_dinner,

                SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS sales_month_breakfast,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS sales_month_lunch,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS sales_month_evening,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS sales_month_dinner,

                SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS sales_year_breakfast,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS sales_year_lunch,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS sales_year_evening,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS sales_year_dinner
            FROM invoices
        `);

        return NextResponse.json(rows.length > 0 ? rows[0] : {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sales data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
 