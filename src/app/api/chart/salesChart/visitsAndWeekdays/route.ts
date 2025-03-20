import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                -- Weekly Visits
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK AND DAYOFWEEK(o.end_time) = 1 THEN c.total_people ELSE 0 END), 0) AS sunday_visits_week,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK AND DAYOFWEEK(o.end_time) = 2 THEN c.total_people ELSE 0 END), 0) AS monday_visits_week,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK AND DAYOFWEEK(o.end_time) = 3 THEN c.total_people ELSE 0 END), 0) AS tuesday_visits_week,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK AND DAYOFWEEK(o.end_time) = 4 THEN c.total_people ELSE 0 END), 0) AS wednesday_visits_week,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK AND DAYOFWEEK(o.end_time) = 5 THEN c.total_people ELSE 0 END), 0) AS thursday_visits_week,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK AND DAYOFWEEK(o.end_time) = 6 THEN c.total_people ELSE 0 END), 0) AS friday_visits_week,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 WEEK AND DAYOFWEEK(o.end_time) = 7 THEN c.total_people ELSE 0 END), 0) AS saturday_visits_week,

                -- Monthly Visits
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH AND DAYOFWEEK(o.end_time) = 1 THEN c.total_people ELSE 0 END), 0) AS sunday_visits_month,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH AND DAYOFWEEK(o.end_time) = 2 THEN c.total_people ELSE 0 END), 0) AS monday_visits_month,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH AND DAYOFWEEK(o.end_time) = 3 THEN c.total_people ELSE 0 END), 0) AS tuesday_visits_month,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH AND DAYOFWEEK(o.end_time) = 4 THEN c.total_people ELSE 0 END), 0) AS wednesday_visits_month,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH AND DAYOFWEEK(o.end_time) = 5 THEN c.total_people ELSE 0 END), 0) AS thursday_visits_month,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH AND DAYOFWEEK(o.end_time) = 6 THEN c.total_people ELSE 0 END), 0) AS friday_visits_month,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 MONTH AND DAYOFWEEK(o.end_time) = 7 THEN c.total_people ELSE 0 END), 0) AS saturday_visits_month,

                -- Yearly Visits
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR AND DAYOFWEEK(o.end_time) = 1 THEN c.total_people ELSE 0 END), 0) AS sunday_visits_year,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR AND DAYOFWEEK(o.end_time) = 2 THEN c.total_people ELSE 0 END), 0) AS monday_visits_year,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR AND DAYOFWEEK(o.end_time) = 3 THEN c.total_people ELSE 0 END), 0) AS tuesday_visits_year,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR AND DAYOFWEEK(o.end_time) = 4 THEN c.total_people ELSE 0 END), 0) AS wednesday_visits_year,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR AND DAYOFWEEK(o.end_time) = 5 THEN c.total_people ELSE 0 END), 0) AS thursday_visits_year,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR AND DAYOFWEEK(o.end_time) = 6 THEN c.total_people ELSE 0 END), 0) AS friday_visits_year,
                COALESCE(SUM(CASE WHEN o.end_time >= NOW() - INTERVAL 1 YEAR AND DAYOFWEEK(o.end_time) = 7 THEN c.total_people ELSE 0 END), 0) AS saturday_visits_year

            FROM customer c
            JOIN orders o ON c.order_id = o.id
        `);

        return NextResponse.json(rows.length > 0 ? rows[0] : {});
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch visits data", details: (error as Error).message },
            { status: 500 }
        );
    } finally {
        await connection.end();
    }
}
