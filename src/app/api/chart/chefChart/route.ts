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

        if (rows.length === 0) {
            // Return mock data if no chefs are found
            return NextResponse.json(generateMockData());
        }

        // Transform the data to match the expected structure
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
                // Mock data for preparation speed (in minutes)
                weekly: rows.map(() => Math.floor(Math.random() * 15) + 5),
                monthly: rows.map(() => Math.floor(Math.random() * 15) + 5),
                yearly: rows.map(() => Math.floor(Math.random() * 15) + 5)
            }
        };

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Error in Chef Chart API:", error);
        return NextResponse.json(generateMockData());
    } finally {
        await connection.end();
    }
}

// Generate mock data if database query fails
function generateMockData() {
    const mockChefs = ['Chef John', 'Chef Maria', 'Chef Alex', 'Chef David'];
    
    return {
        chefs: mockChefs,
        ratings: {
            weekly: mockChefs.map(() => Number((Math.random() * 5).toFixed(1))),
            monthly: mockChefs.map(() => Number((Math.random() * 5).toFixed(1))),
            yearly: mockChefs.map(() => Number((Math.random() * 5).toFixed(1)))
        },
        orders: {
            weekly: mockChefs.map(() => Math.floor(Math.random() * 50) + 10),
            monthly: mockChefs.map(() => Math.floor(Math.random() * 200) + 50),
            yearly: mockChefs.map(() => Math.floor(Math.random() * 1000) + 200)
        },
        speed: {
            weekly: mockChefs.map(() => Math.floor(Math.random() * 15) + 5),
            monthly: mockChefs.map(() => Math.floor(Math.random() * 15) + 5),
            yearly: mockChefs.map(() => Math.floor(Math.random() * 15) + 5)
        }
    };
}
