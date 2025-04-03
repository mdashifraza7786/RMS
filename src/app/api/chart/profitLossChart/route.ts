import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
    const connection = await dbConnect();

    try {
        // Total Sales
        const [sales] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                SUM(total_amount) AS total_sales,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK) THEN total_amount ELSE 0 END) AS weekly_sales,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN total_amount ELSE 0 END) AS monthly_sales,
                SUM(CASE WHEN generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN total_amount ELSE 0 END) AS yearly_sales
            FROM invoices;
        `);

        // Maintenance Costs
        const maintenanceCostPerDay = 500; // Example: Fixed daily cost
        const [days] = await connection.execute<RowDataPacket[]>(`
            SELECT DATEDIFF(CURDATE(), MIN(generated_at)) AS total_days FROM invoices;
        `);
        const totalMaintenanceCost = days[0].total_days * maintenanceCostPerDay;

        // Raw Material Costs
        const [rawMaterialCosts] = await connection.execute<RowDataPacket[]>(`
            SELECT 
                SUM(o.quantity * m.raw_material_cost) AS total_raw_material_cost,
                SUM(CASE WHEN o.generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK) THEN o.quantity * m.raw_material_cost ELSE 0 END) AS weekly_raw_material_cost,
                SUM(CASE WHEN o.generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN o.quantity * m.raw_material_cost ELSE 0 END) AS monthly_raw_material_cost,
                SUM(CASE WHEN o.generated_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN o.quantity * m.raw_material_cost ELSE 0 END) AS yearly_raw_material_cost
            FROM orders o
            JOIN menu m ON o.item_id = m.id;
        `);

        // Salaries
        const totalSalariesPerMonth = 20000; // Example: Fixed monthly salaries
        const totalSalaries = (days[0].total_days / 30) * totalSalariesPerMonth;

        // Profit Calculation
        const totalCosts = totalMaintenanceCost + rawMaterialCosts[0].total_raw_material_cost + totalSalaries;
        const totalProfit = sales[0].total_sales - totalCosts;

        return NextResponse.json({
            total_sales: sales[0].total_sales,
            total_costs: totalCosts,
            total_profit: totalProfit,
            breakdown: {
                maintenance_cost: totalMaintenanceCost,
                raw_material_cost: rawMaterialCosts[0].total_raw_material_cost,
                salaries: totalSalaries,
            },
            weekly: {
                sales: sales[0].weekly_sales,
                raw_material_cost: rawMaterialCosts[0].weekly_raw_material_cost,
                profit: sales[0].weekly_sales - (rawMaterialCosts[0].weekly_raw_material_cost + maintenanceCostPerDay * 7 + (totalSalariesPerMonth / 4)),
            },
            monthly: {
                sales: sales[0].monthly_sales,
                raw_material_cost: rawMaterialCosts[0].monthly_raw_material_cost,
                profit: sales[0].monthly_sales - (rawMaterialCosts[0].monthly_raw_material_cost + maintenanceCostPerDay * 30 + totalSalariesPerMonth),
            },
            yearly: {
                sales: sales[0].yearly_sales,
                raw_material_cost: rawMaterialCosts[0].yearly_raw_material_cost,
                profit: sales[0].yearly_sales - (rawMaterialCosts[0].yearly_raw_material_cost + maintenanceCostPerDay * 365 + totalSalariesPerMonth * 12),
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profit/loss data", details: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
