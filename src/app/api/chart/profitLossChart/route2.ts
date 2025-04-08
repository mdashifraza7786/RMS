// import { NextResponse } from "next/server";
// import { dbConnect } from "@/database/database";
// import mysql, { RowDataPacket } from "mysql2/promise";

// export async function GET() {
//        const connection = await dbConnect();

//        // formula for Profit_Loss: total_amount - total_expenses

//        try {
//               // Second Query: Profit_Loss by Menu Item
//               const [row2] = await connection.execute<RowDataPacket[]>(`
              
//               `);

//               // Third Query: Profit_Loss by Period of Day
//               const [row3] = await connection.execute<RowDataPacket[]>(`
                 
//               `);

//               // Fourth Query: Profit_Loss by Menu Category
//               // const [row4] = await connection.execute<RowDataPacket[]>(`
//               //     SELECT 
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS Profit_Loss_week_breakfast,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS Profit_Loss_week_lunch,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS Profit_Loss_week_evening,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS Profit_Loss_week_dinner,

//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS Profit_Loss_month_breakfast,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS Profit_Loss_month_lunch,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS Profit_Loss_month_evening,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS Profit_Loss_month_dinner,

//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS Profit_Loss_year_breakfast,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS Profit_Loss_year_lunch,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS Profit_Loss_year_evening,
//               //         SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS Profit_Loss_year_dinner
//               //     FROM invoices
//               // `);

//               // Fifth Query: Chef Performance by Profit_Loss
//               const [row5] = await connection.execute<RowDataPacket[]>(`
//                   SELECT 
//                       -- Weekly Profit_Loss
//                       SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS cash_week,
//                       SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS upi_week,
//                       SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS debitcard_week,
//                       SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS creditcard_week,
//                       SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS others_week,

//                       -- Monthly Profit_Loss
//                       SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS cash_month,
//                       SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS upi_month,
//                       SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS debitcard_month,
//                       SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS creditcard_month,
//                       SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS others_month,

//                       -- Yearly Profit_Loss
//                       SUM(CASE WHEN payment_method = 'cash' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS cash_year,
//                       SUM(CASE WHEN payment_method = 'upi' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS upi_year,
//                       SUM(CASE WHEN payment_method = 'debit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS debitcard_year,
//                       SUM(CASE WHEN payment_method = 'credit_card' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS creditcard_year,
//                       SUM(CASE WHEN payment_method = 'others' AND generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS others_year
//                   FROM invoices
//               `);

//               // Sixth Query: Waiter Performance by Profit_Loss
//               const [row6] = await connection.execute<RowDataPacket[]>(`
//                   SELECT 
//                       -- Weekly Profit_Loss
//                       SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS children_week,
//                       SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS teens_week,
//                       SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS adults_week,
//                       SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS middle_aged_week,
//                       SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN i.total_amount ELSE 0 END) AS seniors_week,

//                       -- Monthly Profit_Loss
//                       SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS children_month,
//                       SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS teens_month,
//                       SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS adults_month,
//                       SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS middle_aged_month,
//                       SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN i.total_amount ELSE 0 END) AS seniors_month,

//                       -- Yearly Profit_Loss
//                       SUM(CASE WHEN c.age < 10 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS children_year,
//                       SUM(CASE WHEN c.age BETWEEN 10 AND 18 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS teens_year,
//                       SUM(CASE WHEN c.age BETWEEN 18 AND 40 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS adults_year,
//                       SUM(CASE WHEN c.age BETWEEN 40 AND 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS middle_aged_year,
//                       SUM(CASE WHEN c.age > 60 AND i.generated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN i.total_amount ELSE 0 END) AS seniors_year
//                   FROM invoices i 
//                   JOIN customer c ON i.orderid = c.order_id
//               `);

//               return NextResponse.json({

//               });

//        } catch (error) {
//               return NextResponse.json(
//                      { error: "Failed to fetch Profit_Loss data", details: (error as Error).message },
//                      { status: 500 }
//               );
//        } finally {
//               await connection.end();
//        }
// }
