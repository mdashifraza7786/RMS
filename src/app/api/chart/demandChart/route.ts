import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    try {
        // First Query: Orders by Menu Items
        const [row1] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                -- Weekly orders (Last 7 Days, grouped by Weekday)
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 1 THEN total_amount ELSE 0 END) AS sunday_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 2 THEN total_amount ELSE 0 END) AS monday_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 3 THEN total_amount ELSE 0 END) AS tuesday_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 4 THEN total_amount ELSE 0 END) AS wednesday_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 5 THEN total_amount ELSE 0 END) AS thursday_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 6 THEN total_amount ELSE 0 END) AS friday_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DAYOFWEEK(generated_at) = 7 THEN total_amount ELSE 0 END) AS saturday_orders,
        
                -- Monthly orders (Last 30 Days, grouped by Week Number)
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(generated_at, 1) = WEEK(CURDATE(), 1) - 3 THEN total_amount ELSE 0 END) AS week1_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(generated_at, 1) = WEEK(CURDATE(), 1) - 2 THEN total_amount ELSE 0 END) AS week2_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(generated_at, 1) = WEEK(CURDATE(), 1) - 1 THEN total_amount ELSE 0 END) AS week3_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND WEEK(generated_at, 1) = WEEK(CURDATE(), 1) THEN total_amount ELSE 0 END) AS week4_orders,
        
                -- Yearly orders (Last 12 Months, grouped by Month)
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 1 THEN total_amount ELSE 0 END) AS jan_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 2 THEN total_amount ELSE 0 END) AS feb_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 3 THEN total_amount ELSE 0 END) AS march_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 4 THEN total_amount ELSE 0 END) AS april_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 5 THEN total_amount ELSE 0 END) AS may_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 6 THEN total_amount ELSE 0 END) AS june_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 7 THEN total_amount ELSE 0 END) AS july_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 8 THEN total_amount ELSE 0 END) AS aug_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 9 THEN total_amount ELSE 0 END) AS sept_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 10 THEN total_amount ELSE 0 END) AS oct_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 11 THEN total_amount ELSE 0 END) AS nov_orders,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND MONTH(generated_at) = 12 THEN total_amount ELSE 0 END) AS dec_orders
        
            FROM invoices;
        `);        
        
        // Second Query: Orders by Dish Category
        const [row2] = await connection.execute<RowDataPacket[]>(`
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
                -- Weekly orders
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS cash_week,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS upi_week,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS debitcard_week,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS creditcard_week,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS others_week,

                -- Monthly orders
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS cash_month,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS upi_month,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS debitcard_month,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS creditcard_month,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS others_month,

                -- Yearly orders
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS cash_year,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS upi_year,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS debitcard_year,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS creditcard_year,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS others_year
            FROM invoices
        `);

        return NextResponse.json({
            ...row1[0], 
            ...row2[0],
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
