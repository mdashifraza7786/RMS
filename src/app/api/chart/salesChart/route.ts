import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();
    
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                u.userid, 
                u.name, 
                u.ratings, 
                COUNT(o.waiter_id) AS total_orders,
                COUNT(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK THEN 1 END) AS total_orders_week,
                COUNT(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH THEN 1 END) AS total_orders_month,
                COUNT(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR THEN 1 END) AS total_orders_year
            FROM user u
            LEFT JOIN orders o ON u.userid = o.waiter_id
            WHERE u.role = 'waiter'
            GROUP BY u.userid, u.name, u.ratings;
        `);

        return NextResponse.json(rows.length > 0 ? rows : []);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sales data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
