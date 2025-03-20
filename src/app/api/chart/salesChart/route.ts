import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    try {
        // First Query: Total Sales
        const [row1] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                SUM(total_amount) AS total_sales,
                SUM(CASE WHEN generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS total_sales_week,
                SUM(CASE WHEN generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS total_sales_month,
                SUM(CASE WHEN generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS total_sales_year
            FROM invoices
        `);

        // Second Query: Sales by Time of Day
        const [row2] = await connection.execute<RowDataPacket[]>(`
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

        // Third Query: visits by weekdays
        const [row3] = await connection.execute<RowDataPacket[]>(`
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

        // Fourth Query: Sales by dish category
        const [row4] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS sales_week_breakfast,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS sales_week_lunch,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS sales_week_evening,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS sales_week_dinner,

                SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS sales_month_breakfast,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS sales_month_lunch,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS sales_month_evening,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS sales_month_dinner,

                SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS sales_year_breakfast,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS sales_year_lunch,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS sales_year_evening,
                SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS sales_year_dinner
            FROM invoices
        `);

        // Fifth Query: Sales by Payment Method
        const [row5] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                -- Weekly Sales
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS cash_week,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS upi_week,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS debitcard_week,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS creditcard_week,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS others_week,

                -- Monthly Sales
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS cash_month,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS upi_month,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS debitcard_month,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS creditcard_month,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS others_month,

                -- Yearly Sales
                SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS cash_year,
                SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS upi_year,
                SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS debitcard_year,
                SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS creditcard_year,
                SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS others_year
            FROM invoices
        `);

        // Sixth Query: Sales by Age Group
        const [row6] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                -- Weekly Sales
                SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS children_week,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS teens_week,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS adults_week,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS middle_aged_week,
                SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS seniors_week,

                -- Monthly Sales
                SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS children_month,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS teens_month,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS adults_month,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS middle_aged_month,
                SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS seniors_month,

                -- Yearly Sales
                SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS children_year,
                SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS teens_year,
                SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS adults_year,
                SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS middle_aged_year,
                SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS seniors_year
            FROM invoices i 
            JOIN customer c ON i.orderid = c.order_id
        `);

        // Seventh Query: Sales by Gender
        const [row7] = await connection.execute<RowDataPacket[]>(`
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


        return NextResponse.json({
            ...row1[0], 
            ...row2[0],
            ...row3[0],
            ...row4[0],
            ...row5[0],
            ...row6[0],
            ...row7[0],
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sales data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
