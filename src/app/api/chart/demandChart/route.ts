import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    try {
        // First Query: Orders by Menu Items
        // const [row1] = await connection.execute<RowDataPacket[]>(`
        //     SELECT 
        //         -- Weekly orders (Last 7 Days, grouped by Weekday)
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 1 THEN total_amount ELSE 0 END) AS sunday_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 2 THEN total_amount ELSE 0 END) AS monday_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 3 THEN total_amount ELSE 0 END) AS tuesday_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 4 THEN total_amount ELSE 0 END) AS wednesday_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 5 THEN total_amount ELSE 0 END) AS thursday_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 6 THEN total_amount ELSE 0 END) AS friday_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 7 THEN total_amount ELSE 0 END) AS saturday_orders,
        
        //         -- Monthly orders (Last 30 Days, grouped by Week Number)
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(generated_at, 1) = WEEK(CURDATE(), 1) - 3 THEN total_amount ELSE 0 END) AS week1_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(generated_at, 1) = WEEK(CURDATE(), 1) - 2 THEN total_amount ELSE 0 END) AS week2_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(generated_at, 1) = WEEK(CURDATE(), 1) - 1 THEN total_amount ELSE 0 END) AS week3_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(generated_at, 1) = WEEK(CURDATE(), 1) THEN total_amount ELSE 0 END) AS week4_orders,
        
        //         -- Yearly orders (Last 12 Months, grouped by Month)
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 1 THEN total_amount ELSE 0 END) AS jan_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 2 THEN total_amount ELSE 0 END) AS feb_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 3 THEN total_amount ELSE 0 END) AS march_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 4 THEN total_amount ELSE 0 END) AS april_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 5 THEN total_amount ELSE 0 END) AS may_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 6 THEN total_amount ELSE 0 END) AS june_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 7 THEN total_amount ELSE 0 END) AS july_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 8 THEN total_amount ELSE 0 END) AS aug_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 9 THEN total_amount ELSE 0 END) AS sept_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 10 THEN total_amount ELSE 0 END) AS oct_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 11 THEN total_amount ELSE 0 END) AS nov_orders,
        //         SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 12 THEN total_amount ELSE 0 END) AS dec_orders
        
        //     FROM invoices;
        // `);        
        
        // // Second Query: Orders by Dish Category
        // const [row2] = await connection.execute<RowDataPacket[]>(`
        //     SELECT 
        //         -- Weekly orders by category (last 7 days)
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
        //             AND m.item_type = 'Main Course' 
        //             THEN 1 END) AS orders_week_maincourse,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
        //             AND m.item_type = 'Beverages' 
        //             THEN 1 END) AS orders_week_beverages,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
        //             AND m.item_type = 'Starter' 
        //             THEN 1 END) AS orders_week_starter,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
        //             AND m.item_type = 'Dessert' 
        //             THEN 1 END) AS orders_week_dessert,

        //         -- Monthly orders by category (last 30 days)
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) 
        //             AND m.item_type = 'Main Course' 
        //             THEN 1 END) AS orders_month_maincourse,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) 
        //             AND m.item_type = 'Beverages' 
        //             THEN 1 END) AS orders_month_beverages,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) 
        //             AND m.item_type = 'Starter' 
        //             THEN 1 END) AS orders_month_starter,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) 
        //             AND m.item_type = 'Dessert' 
        //             THEN 1 END) AS orders_month_dessert,

        //         -- Yearly orders by category (last 12 months)
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) 
        //             AND m.item_type = 'Main Course' 
        //             THEN 1 END) AS orders_year_maincourse,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) 
        //             AND m.item_type = 'Beverages' 
        //             THEN 1 END) AS orders_year_beverages,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) 
        //             AND m.item_type = 'Starter' 
        //             THEN 1 END) AS orders_year_starter,
        //         COUNT(CASE 
        //             WHEN o.start_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) 
        //             AND m.item_type = 'Dessert' 
        //             THEN 1 END) AS orders_year_dessert
        //     FROM orders o
        //     CROSS JOIN JSON_TABLE(
        //         o.order_items,
        //         '$[*]' COLUMNS (
        //             item_id INT PATH '$.item_id'
        //         )
        //     ) AS jt
        //     JOIN menu m ON jt.item_id = m.id
        // `);

        // Third Query: Orders by Period of day
        const [row3] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                SUM(CASE WHEN TIME(start_time) BETWEEN '07:00:00' AND '11:00:00' AND start_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_week_breakfast,
                SUM(CASE WHEN TIME(start_time) BETWEEN '11:00:00' AND '15:00:00' AND start_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_week_lunch,
                SUM(CASE WHEN TIME(start_time) BETWEEN '15:00:00' AND '19:00:00' AND start_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_week_evening,
                SUM(CASE WHEN TIME(start_time) BETWEEN '19:00:00' AND '23:59:59' AND start_time >= NOW() - INTERVAL 1 WEEK THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_week_dinner,

                SUM(CASE WHEN TIME(start_time) BETWEEN '07:00:00' AND '11:00:00' AND start_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_month_breakfast,
                SUM(CASE WHEN TIME(start_time) BETWEEN '11:00:00' AND '15:00:00' AND start_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_month_lunch,
                SUM(CASE WHEN TIME(start_time) BETWEEN '15:00:00' AND '19:00:00' AND start_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_month_evening,
                SUM(CASE WHEN TIME(start_time) BETWEEN '19:00:00' AND '23:59:59' AND start_time >= NOW() - INTERVAL 1 MONTH THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_month_dinner,

                SUM(CASE WHEN TIME(start_time) BETWEEN '07:00:00' AND '11:00:00' AND start_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_year_breakfast,
                SUM(CASE WHEN TIME(start_time) BETWEEN '11:00:00' AND '15:00:00' AND start_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_year_lunch,
                SUM(CASE WHEN TIME(start_time) BETWEEN '15:00:00' AND '19:00:00' AND start_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_year_evening,
                SUM(CASE WHEN TIME(start_time) BETWEEN '19:00:00' AND '23:59:59' AND start_time >= NOW() - INTERVAL 1 YEAR THEN JSON_LENGTH(order_items) ELSE 0 END) AS orders_year_dinner
            FROM orders
        `);

        // Fourth Query: Orders by Timeline
        const [row4] = await connection.execute<RowDataPacket[]>(`
            SELECT 

                -- Weekly os (Last 7 Days, grouped by Weekday)
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(end_time) = 1 THEN JSON_LENGTH(order_items) ELSE 0 END) AS sunday_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(end_time) = 2 THEN JSON_LENGTH(order_items) ELSE 0 END) AS monday_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(end_time) = 3 THEN JSON_LENGTH(order_items) ELSE 0 END) AS tuesday_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(end_time) = 4 THEN JSON_LENGTH(order_items) ELSE 0 END) AS wednesday_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(end_time) = 5 THEN JSON_LENGTH(order_items) ELSE 0 END) AS thursday_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(end_time) = 6 THEN JSON_LENGTH(order_items) ELSE 0 END) AS friday_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(end_time) = 7 THEN JSON_LENGTH(order_items) ELSE 0 END) AS saturday_orders,
        
                -- Monthly orders (Last 30 Days, grouped by Week Number)
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(end_time, 1) = WEEK(CURDATE(), 1) - 3 THEN JSON_LENGTH(order_items) ELSE 0 END) AS week1_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(end_time, 1) = WEEK(CURDATE(), 1) - 2 THEN JSON_LENGTH(order_items) ELSE 0 END) AS week2_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(end_time, 1) = WEEK(CURDATE(), 1) - 1 THEN JSON_LENGTH(order_items) ELSE 0 END) AS week3_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(end_time, 1) = WEEK(CURDATE(), 1) THEN JSON_LENGTH(order_items) ELSE 0 END) AS week4_orders,
        
                -- Yearly orders (Last 12 Months, grouped by Month)
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 1 THEN JSON_LENGTH(order_items) ELSE 0 END) AS jan_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 2 THEN JSON_LENGTH(order_items) ELSE 0 END) AS feb_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 3 THEN JSON_LENGTH(order_items) ELSE 0 END) AS march_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 4 THEN JSON_LENGTH(order_items) ELSE 0 END) AS april_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 5 THEN JSON_LENGTH(order_items) ELSE 0 END) AS may_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 6 THEN JSON_LENGTH(order_items) ELSE 0 END) AS june_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 7 THEN JSON_LENGTH(order_items) ELSE 0 END) AS july_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 8 THEN JSON_LENGTH(order_items) ELSE 0 END) AS aug_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 9 THEN JSON_LENGTH(order_items) ELSE 0 END) AS sept_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 10 THEN JSON_LENGTH(order_items) ELSE 0 END) AS oct_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 11 THEN JSON_LENGTH(order_items) ELSE 0 END) AS nov_orders,
                SUM(CASE WHEN end_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(end_time) = 12 THEN JSON_LENGTH(order_items) ELSE 0 END) AS dec_orders
        
            FROM orders;
        `);

        // Fifth Query: Orders by Age Group
        const [row5] = await connection.execute<RowDataPacket[]>(`
             SELECT 
                -- Weekly Orders
                SUM(CASE WHEN c.age < 10 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS children_week,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS teens_week,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS adults_week,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS middle_aged_week,
                SUM(CASE WHEN c.age > 60 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS seniors_week,

                -- Monthly Orders
                SUM(CASE WHEN c.age < 10 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS children_month,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS teens_month,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS adults_month,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS middle_aged_month,
                SUM(CASE WHEN c.age > 60 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS seniors_month,

                -- Yearly Orders
                SUM(CASE WHEN c.age < 10 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS children_year,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS teens_year,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS adults_year,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS middle_aged_year,
                SUM(CASE WHEN c.age > 60 AND o.end_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN JSON_LENGTH(o.order_items) ELSE 0 END) AS seniors_year
            FROM orders o 
            JOIN customer c ON o.id = c.order_id
        `);


        return NextResponse.json({
            // ...row1[0], 
            // ...row2[0],
            ...row3[0],
            ...row4[0],
            ...row5[0],
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch demand data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
