import { dbConnect, getInventoryOrderById } from '@/database/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();
    const { item_name, quantity, date, time, unit,remarks } = data; // Removed order_id

    function generateFiveDigitRandomNumber(): number {
        return Math.floor(10000 + Math.random() * 90000); 
    }

    async function generateUniqueOrderId(): Promise<string> {
        let uniqueID: string;
        let orderExists: boolean;

        do {
            uniqueID = `ORDER${generateFiveDigitRandomNumber()}`;
            const order = await getInventoryOrderById(uniqueID);
            orderExists = !!order;
        } while (orderExists);

        return uniqueID;
    }

    const uniqueID = await generateUniqueOrderId(); // Generate unique order_id

    const connection = await dbConnect();
    try {
        await connection.beginTransaction();

        // Insert into recent_inventory_order table
        await connection.query(
            `INSERT INTO recent_inventory_order (order_id, order_name, price, quantity, date, time, total_amount, unit,remarks) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`, 
            [uniqueID, item_name, 0, quantity, date, time, 0, unit,remarks]
        );

        await connection.commit();

        return NextResponse.json({ 
            message: "Data inserted successfully", 
            cred: { order_id: uniqueID, item_name, quantity, date, time, unit,remarks } 
        });
    } catch (err: any) {
        await connection.rollback();
        console.error("Database Error:", err); // Log error
        return NextResponse.json({ error: err.message });
    } finally {
        await connection.end();
    }
}
