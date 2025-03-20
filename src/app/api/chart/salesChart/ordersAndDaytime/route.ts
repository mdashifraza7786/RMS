import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();
    
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                SUM(CASE WHEN TIME(start_time) BETWEEN '07:00:00' AND '11:00:00' AND start_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_week_breakfast,
                SUM(CASE WHEN TIME(start_time) BETWEEN '11:00:00' AND '15:00:00' AND start_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_week_lunch,
                SUM(CASE WHEN TIME(start_time) BETWEEN '15:00:00' AND '19:00:00' AND start_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_week_evening,
                SUM(CASE WHEN TIME(start_time) BETWEEN '19:00:00' AND '23:59:59' AND start_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_week_dinner,

                SUM(CASE WHEN TIME(start_time) BETWEEN '07:00:00' AND '11:00:00' AND start_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_month_breakfast,
                SUM(CASE WHEN TIME(start_time) BETWEEN '11:00:00' AND '15:00:00' AND start_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_month_lunch,
                SUM(CASE WHEN TIME(start_time) BETWEEN '15:00:00' AND '19:00:00' AND start_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_month_evening,
                SUM(CASE WHEN TIME(start_time) BETWEEN '19:00:00' AND '23:59:59' AND start_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_month_dinner,

                SUM(CASE WHEN TIME(start_time) BETWEEN '07:00:00' AND '11:00:00' AND start_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_year_breakfast,
                SUM(CASE WHEN TIME(start_time) BETWEEN '11:00:00' AND '15:00:00' AND start_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_year_lunch,
                SUM(CASE WHEN TIME(start_time) BETWEEN '15:00:00' AND '19:00:00' AND start_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_year_evening,
                SUM(CASE WHEN TIME(start_time) BETWEEN '19:00:00' AND '23:59:59' AND start_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(order_items) ELSE 0 END) AS items_count_year_dinner
            FROM orders
        `);

        return NextResponse.json(rows.length > 0 ? rows[0] : {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sales data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
 