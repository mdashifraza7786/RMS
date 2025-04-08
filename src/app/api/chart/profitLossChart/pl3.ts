import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import mysql, { RowDataPacket } from "mysql2/promise";

const TIME_SLOTS = {
    breakfast: ["07:00:00", "11:00:00"],
    lunch: ["11:00:00", "15:00:00"],
    evening: ["15:00:00", "19:00:00"],
    dinner: ["19:00:00", "23:00:00"],
};

const TIME_RANGES = {
    week: "7 DAY",
    month: "1 MONTH",
    year: "1 YEAR",
};

async function fetchSumBySlotAndRange(connection: mysql.Connection, table: string, column: string, dateCol: string, slot: string[], range: string) {
    const [result] = await connection.execute<RowDataPacket[]>(
        `SELECT SUM(${column}) as total FROM ${table}
         WHERE DATE(${dateCol}) >= CURDATE() - INTERVAL ${range}
         AND TIME(${dateCol}) BETWEEN ? AND ?`,
        slot
    );
    return result[0].total || 0;
}

export async function GET() {
    const connection = await dbConnect();

    try {
        const data: any = {};

        for (const [meal, slot] of Object.entries(TIME_SLOTS)) {
            data[meal] = {};

            for (const [label, range] of Object.entries(TIME_RANGES)) {
                const invoices = await fetchSumBySlotAndRange(connection, "invoices", "total_amount", "generated_at", slot, range);
                const expenses = await fetchSumBySlotAndRange(connection, "expenses", "cost", "date", slot, range);
                const payouts = await fetchSumBySlotAndRange(connection, "payout", "amount", "date", slot, range);
                const inventory = await fetchSumBySlotAndRange(connection, "recent_inventory_order", "total_amount", "date", slot, range);

                const total_expenses = Number(expenses) + Number(payouts) + Number(inventory);
                const profit_loss = Number(invoices) - total_expenses;

                data[meal][label] = {
                    profit_loss
                };
            }
        }

        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        console.error("Error fetching profit/loss data:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    } finally {
        await connection.end();
    }
}
