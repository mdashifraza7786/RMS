import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    // formula for Profit_Loss: total_amount - total_expenses

    try {
        // Get invoices from the last 7 days, 1 month, 1 year
        const [invoices_week] = await connection.execute<RowDataPacket[]>(`
            SELECT total_amount, generated_at FROM invoices
            WHERE DATE(generated_at) >= CURDATE() - INTERVAL 7 DAY
        `);
        const [invoices_month] = await connection.execute<RowDataPacket[]>(`
            SELECT total_amount, generated_at FROM invoices
            WHERE DATE(generated_at) >= CURDATE() - INTERVAL 1 MONTH
        `);
        const [invoices_year] = await connection.execute<RowDataPacket[]>(`
            SELECT total_amount, generated_at FROM invoices
            WHERE DATE(generated_at) >= CURDATE() - INTERVAL 1 YEAR
        `);

        // Get expenses from the last 7 days, 1 month, 1 year
        const [expenses_week] = await connection.execute<RowDataPacket[]>(`
            SELECT cost AS expense_cost, date AS expense_date FROM expenses
            WHERE DATE(date) >= CURDATE() - INTERVAL 7 DAY
        `);
        const [expenses_month] = await connection.execute<RowDataPacket[]>(`
            SELECT cost AS expense_cost, date AS expense_date FROM expenses
            WHERE DATE(date) >= CURDATE() - INTERVAL 1 MONTH
        `);
        const [expenses_year] = await connection.execute<RowDataPacket[]>(`
            SELECT cost AS expense_cost, date AS expense_date FROM expenses
            WHERE DATE(date) >= CURDATE() - INTERVAL 1 YEAR
        `);

        // Get payouts from the last 7 days, 1 month, 1 year
        const [payouts_week] = await connection.execute<RowDataPacket[]>(`
            SELECT amount AS payout_amount, date AS payout_date FROM payout
            WHERE DATE(date) >= CURDATE() - INTERVAL 7 DAY
        `);
        const [payouts_month] = await connection.execute<RowDataPacket[]>(`
            SELECT amount AS payout_amount, date AS payout_date FROM payout
            WHERE DATE(date) >= CURDATE() - INTERVAL 1 MONTH
        `);
        const [payouts_year] = await connection.execute<RowDataPacket[]>(`
            SELECT amount AS payout_amount, date AS payout_date FROM payout
            WHERE DATE(date) >= CURDATE() - INTERVAL 1 YEAR
        `);

        // Get inventory orders from the last 7 days, 1 month, 1 year
        const [inventoryOrders_week] = await connection.execute<RowDataPacket[]>(`
            SELECT total_amount, date FROM recent_inventory_order
            WHERE DATE(date) >= CURDATE() - INTERVAL 7 DAY
        `);
        const [inventoryOrders_month] = await connection.execute<RowDataPacket[]>(`
            SELECT total_amount, date FROM recent_inventory_order
            WHERE DATE(date) >= CURDATE() - INTERVAL 1 MONTH
        `);
        const [inventoryOrders_year] = await connection.execute<RowDataPacket[]>(`
            SELECT total_amount, date FROM recent_inventory_order
            WHERE DATE(date) >= CURDATE() - INTERVAL 1 YEAR
        `);

        // Weekly breakdown by weekday
        const filterBasedOnWeekday = () => {
            const result: Record<string, number> = {};
            for (let day = 0; day < 7; day++) {
                const invoicesSum = invoices_week
                    .filter((inv: any) => new Date(inv.generated_at).getDay() === day)
                    .reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0);

                const expensesSum = expenses_week
                    .filter((exp: any) => new Date(exp.expense_date).getDay() === day)
                    .reduce((acc, exp) => acc + (Number(exp.expense_cost) || 0), 0);

                const payoutsSum = payouts_week
                    .filter((p: any) => new Date(p.payout_date).getDay() === day)
                    .reduce((acc, p) => acc + (Number(p.payout_amount) || 0), 0);

                const inventorySum = inventoryOrders_week
                    .filter((inv: any) => new Date(inv.date).getDay() === day)
                    .reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0);

                const profitLoss = invoicesSum - expensesSum - payoutsSum - inventorySum;

                const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day];
                result[`${dayName}_pl`] = profitLoss;
            }
            return result;
        };

        // Monthly breakdown by week number in the month
        const filterBasedOnMonth = () => {
            const result: Record<string, number> = {
                week1_pl: 0,
                week2_pl: 0,
                week3_pl: 0,
                week4_pl: 0,
            };

            const getWeekOfMonth = (date: Date) => {
                const day = date.getDate();
                return Math.min(Math.ceil(day / 7), 4);
            };

            const addToWeek = (key: string, value: any) => {
                result[key] += typeof value === "number" ? value : parseFloat(value);
            };

            invoices_month.forEach((inv: any) => {
                const week = getWeekOfMonth(new Date(inv.generated_at));
                addToWeek(`week${week}_pl`, inv.total_amount);
            });

            expenses_month.forEach((exp: any) => {
                const week = getWeekOfMonth(new Date(exp.expense_date));
                addToWeek(`week${week}_pl`, -exp.expense_cost);
            });

            payouts_month.forEach((p: any) => {
                const week = getWeekOfMonth(new Date(p.payout_date));
                addToWeek(`week${week}_pl`, -p.payout_amount);
            });

            inventoryOrders_month.forEach((inv: any) => {
                const week = getWeekOfMonth(new Date(inv.date));
                addToWeek(`week${week}_pl`, -inv.total_amount);
            });

            return result;
        };

        // Yearly breakdown by month
        const filterBasedonYear = () => {
            const result: Record<string, number> = {
                jan_pl: 0,
                feb_pl: 0,
                mar_pl: 0,
                apr_pl: 0,
                may_pl: 0,
                jun_pl: 0,
                jul_pl: 0,
                aug_pl: 0,
                sep_pl: 0,
                oct_pl: 0,
                nov_pl: 0,
                dec_pl: 0,
            };
        
            const monthKeys = [
                "jan_pl", "feb_pl", "mar_pl", "apr_pl", "may_pl", "jun_pl",
                "jul_pl", "aug_pl", "sep_pl", "oct_pl", "nov_pl", "dec_pl"
            ];
        
            const getMonth = (date: Date) => {
                return date.getMonth(); // 0-indexed
            };
        
            const addToMonth = (monthIndex: number, value: any) => {
                const key = monthKeys[monthIndex];
                const numericValue = typeof value === "number" ? value : parseFloat(value);
                result[key] += isNaN(numericValue) ? 0 : numericValue;
            };
        
            invoices_year.forEach((inv: any) => {
                const month = getMonth(new Date(inv.generated_at));
                addToMonth(month, inv.total_amount);
            });
        
            expenses_year.forEach((exp: any) => {
                const month = getMonth(new Date(exp.expense_date));
                addToMonth(month, -exp.expense_cost);
            });
        
            payouts_year.forEach((p: any) => {
                const month = getMonth(new Date(p.payout_date));
                addToMonth(month, -p.payout_amount);
            });
        
            inventoryOrders_year.forEach((inv: any) => {
                const month = getMonth(new Date(inv.date));
                addToMonth(month, -inv.total_amount);
            });
        
            return result;
        };
        
        // Time-based breakdown for the last week, month, year
        const timeBasedBreakdown = async () => {
            const [results] = await connection.execute<RowDataPacket[]>(`
                SELECT 
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS \`Profit_Loss_week_breakfast\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS \`Profit_Loss_week_lunch\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS \`Profit_Loss_week_evening\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 WEEK THEN total_amount ELSE 0 END) AS \`Profit_Loss_week_dinner\`,

                    SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS \`Profit_Loss_month_breakfast\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS \`Profit_Loss_month_lunch\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS \`Profit_Loss_month_evening\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 MONTH THEN total_amount ELSE 0 END) AS \`Profit_Loss_month_dinner\`,

                    SUM(CASE WHEN TIME(generated_at) BETWEEN '07:00:00' AND '11:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS \`Profit_Loss_year_breakfast\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '11:00:00' AND '15:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS \`Profit_Loss_year_lunch\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '15:00:00' AND '19:00:00' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS \`Profit_Loss_year_evening\`,
                    SUM(CASE WHEN TIME(generated_at) BETWEEN '19:00:00' AND '23:59:59' AND generated_at >= NOW() - INTERVAL 1 YEAR THEN total_amount ELSE 0 END) AS \`Profit_Loss_year_dinner\`
                FROM invoices
            `);

            return results[0];
        };
        
        const timeBasedResults = await timeBasedBreakdown();

        return NextResponse.json({
            row1: {
                weeklyProfitLoss: filterBasedOnWeekday(),
                monthlyProfitLoss: filterBasedOnMonth(),
                yearlyProfitLoss: filterBasedonYear(),
            },
            row2: {}, // add if needed
            row3: {}, // add if needed
            timeBasedProfitLoss: timeBasedResults,
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch Profit_Loss data", details: (error as Error).message },
            { status: 500 }
        );
    } finally {
        await connection.end();
    }
}
