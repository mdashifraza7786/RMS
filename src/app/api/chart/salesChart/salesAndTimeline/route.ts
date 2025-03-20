import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();
    
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                SUM(total_amount) AS total_sales,
                SUM(CASE WHEN generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount END) AS total_sales_week,
                SUM(CASE WHEN generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount END) AS total_sales_month,
                SUM(CASE WHEN generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount END) AS total_sales_year
            FROM invoices
        `);

        return NextResponse.json(rows.length > 0 ? rows : []);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sales data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
