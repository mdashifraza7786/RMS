import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                -- Weekly Sales
                SUM(CASE WHEN c.gender='male' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS male_week,
                SUM(CASE WHEN c.gender='female' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS female_week,
                SUM(CASE WHEN c.gender='other' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS other_week,

                -- Monthly Sales
                SUM(CASE WHEN c.gender='male' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS male_month,
                SUM(CASE WHEN c.gender='female' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS female_month,
                SUM(CASE WHEN c.gender='other' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS other_month,

                -- Yearly Sales
                SUM(CASE WHEN c.gender='male' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS male_year,
                SUM(CASE WHEN c.gender='female' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS female_year,
                SUM(CASE WHEN c.gender='other' AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS other_year
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
