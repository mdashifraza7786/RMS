import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                -- Weekly Sales
                SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS children_week,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS teens_week,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS adults_week,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS middle_aged_week,
                SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS seniors_week,

                -- Monthly Sales
                SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS children_month,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS teens_month,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS adults_month,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS middle_aged_month,
                SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS seniors_month,

                -- Yearly Sales
                SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS children_year,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS teens_year,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS adults_year,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS middle_aged_year,
                SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS seniors_year
            FROM invoices i 
            JOIN customer c ON i.orderid = c.order_id
        `);

        return NextResponse.json(rows.length > 0 ? rows[0] : {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sales data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
