import { NextResponse } from 'next/server';
import { dbConnect } from '@/database';
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

        if (rows.length === 0) {
            return NextResponse.json(getEmptyData());
        }

        const chefs = rows.map((row: any) => row.name);
        
        const formattedData = {
            chefs: chefs,
            ratings: {
                weekly: rows.map((row: any) => Number(row.ratings) || 0),
                monthly: rows.map((row: any) => Number(row.ratings) || 0),
                yearly: rows.map((row: any) => Number(row.ratings) || 0)
            },
            orders: {
                weekly: rows.map((row: any) => Number(row.total_orders_week) || 0),
                monthly: rows.map((row: any) => Number(row.total_orders_month) || 0),
                yearly: rows.map((row: any) => Number(row.total_orders_year) || 0)
            },
            speed: {
                weekly: rows.map(() => 0),
                monthly: rows.map(() => 0),
                yearly: rows.map(() => 0)
            }
        };

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Error in Chef Chart API:", error);
        return NextResponse.json(getEmptyData());
    } finally {
        await connection.release();
    }
}

function getEmptyData() {
    return {
        chefs: [],
        ratings: { weekly: [], monthly: [], yearly: [] },
        orders: { weekly: [], monthly: [], yearly: [] },
        speed: { weekly: [], monthly: [], yearly: [] }
    };
}
