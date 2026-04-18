import { NextResponse } from "next/server";
import { dbConnect } from "@/database";
import { RowDataPacket } from "mysql2/promise";
import { getCache, setCache } from "@/lib/cache";

export async function GET() {
    const cacheKey = "profit_loss_chart";
    const cachedData = getCache(cacheKey);
    if (cachedData) {
        return NextResponse.json(cachedData);
    }

    const connection = await dbConnect();

    // formula for profit/loss: total_amount - total_expenses

    try {

        // First Query: Total Profit/Loss
        const [row1] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                -- WEEKLY Profit/Loss (By Day of Week)
                SUM(CASE WHEN DAYOFWEEK(i.generated_at) = 1 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS sunday_Profit_Loss,
                SUM(CASE WHEN DAYOFWEEK(i.generated_at) = 2 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS monday_Profit_Loss,
                SUM(CASE WHEN DAYOFWEEK(i.generated_at) = 3 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS tuesday_Profit_Loss,
                SUM(CASE WHEN DAYOFWEEK(i.generated_at) = 4 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS wednesday_Profit_Loss,
                SUM(CASE WHEN DAYOFWEEK(i.generated_at) = 5 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS thursday_Profit_Loss,
                SUM(CASE WHEN DAYOFWEEK(i.generated_at) = 6 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS friday_Profit_Loss,
                SUM(CASE WHEN DAYOFWEEK(i.generated_at) = 7 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS saturday_Profit_Loss,
        
                -- MONTHLY Profit/Loss (Last 4 Weeks)
                SUM(CASE WHEN WEEK(i.generated_at, 1) = WEEK(CURDATE(), 1) - 3 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS week1_Profit_Loss,
                SUM(CASE WHEN WEEK(i.generated_at, 1) = WEEK(CURDATE(), 1) - 2 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS week2_Profit_Loss,
                SUM(CASE WHEN WEEK(i.generated_at, 1) = WEEK(CURDATE(), 1) - 1 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS week3_Profit_Loss,
                SUM(CASE WHEN WEEK(i.generated_at, 1) = WEEK(CURDATE(), 1) THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS week4_Profit_Loss,
        
                -- YEARLY Profit/Loss (By Month)
                SUM(CASE WHEN MONTH(i.generated_at) = 1 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS jan_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 2 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS feb_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 3 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS mar_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 4 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS apr_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 5 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS may_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 6 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS jun_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 7 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS jul_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 8 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS aug_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 9 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS sep_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 10 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS oct_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 11 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS nov_Profit_Loss,
                SUM(CASE WHEN MONTH(i.generated_at) = 12 THEN i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0) ELSE 0 END) AS dec_Profit_Loss,
        
                -- Total Yearly Profit/Loss
                SUM(i.total_amount - IFNULL(e.cost, 0) - IFNULL(r.total_amount, 0) - IFNULL(p.amount, 0)) AS total_year_Profit_Loss
        
            FROM invoices i
            LEFT JOIN expenses e ON i.generated_at >= CONCAT(DATE(e.date), ' 00:00:00') AND i.generated_at <= CONCAT(DATE(e.date), ' 23:59:59')
            LEFT JOIN payout p ON i.generated_at >= CONCAT(DATE(p.date), ' 00:00:00') AND i.generated_at <= CONCAT(DATE(p.date), ' 23:59:59')
            LEFT JOIN recent_inventory_order r ON i.generated_at >= CONCAT(DATE(r.date), ' 00:00:00') AND i.generated_at <= CONCAT(DATE(r.date), ' 23:59:59')
            WHERE i.generated_at >= ? AND i.generated_at <= ?
        `, [
            `${new Date().getFullYear()}-01-01 00:00:00`,
            `${new Date().getFullYear()}-12-31 23:59:59`
        ]);
                 
        const responseData = { ...row1[0] };
        setCache(cacheKey, responseData, 600);
        return NextResponse.json(responseData);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profit/loss data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.release();
    }
}
