import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    const connection = await dbConnect();
    
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                u.userid, 
                u.name, 
                u.ratings, 
                COALESCE(SUM(JSON_LENGTH(o.order_items)), 0) AS total_orders,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(o.order_items) END), 0) AS total_orders_week,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(o.order_items) END), 0) AS total_orders_month,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(o.order_items) END), 0) AS total_orders_year
            FROM user u
            LEFT JOIN orders o ON u.userid = o.chef_id
            WHERE u.role = 'chef'
            GROUP BY u.userid, u.name, u.ratings;
        `);

        return NextResponse.json(rows.length > 0 ? rows : []);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chef data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
