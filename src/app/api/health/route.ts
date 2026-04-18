import { NextResponse } from "next/server";
import { dbConnect, testConnection } from "@/database/connection";
import { RowDataPacket } from "mysql2";

export async function GET() {
    const checks = {
        database: false,
        tables: {
            user: false,
            user_address: false,
            orders: false,
            invoices: false,
            inventory: false,
            menu: false,
            menu_item_ingredients: false,
            payout: false,
            payout_details: false,
            attendance: false,
            expenses: false,
            customer: false,
            kitchen_order: false,
            recent_inventory_order: false,
            tables: false
        }
    };

    try {
        // 1. Check Connection
        checks.database = await testConnection();

        if (checks.database) {
            const connection = await dbConnect();
            
            // 2. Check Tables
            const [rows]: any = await connection.query("SHOW TABLES");
            const dbName = process.env.DB_NAME || 'rms';
            const tableKey = `Tables_in_${dbName}`;
            
            const existingTables = rows.map((row: any) => row[Object.keys(row)[0]]);

            (Object.keys(checks.tables) as Array<keyof typeof checks.tables>).forEach(table => {
                if (existingTables.includes(table)) {
                    checks.tables[table] = true;
                }
            });

            connection.release();
        }

        const allTablesOk = Object.values(checks.tables).every(v => v === true);
        const overallSuccess = checks.database && allTablesOk;

        return NextResponse.json({
            success: overallSuccess,
            checks
        }, { status: overallSuccess ? 200 : 503 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Health check failed",
            checks
        }, { status: 500 });
    }
}
