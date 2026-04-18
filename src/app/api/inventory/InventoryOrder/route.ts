import { dbConnect, getInventoryOrderById } from '@/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();
    const { item_id, item_name, quantity, date, time, unit, remarks } = data; 

    function generateFiveDigitRandomNumber(): number {
        return 10000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 90000);
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

    const uniqueID = await generateUniqueOrderId();

    const connection = await dbConnect();
    try {
        await connection.beginTransaction();

        // Ensure `date` is stored correctly
        const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format

        await connection.query(
            `INSERT INTO recent_inventory_order (order_id, item_id, order_name, price, quantity, date, total_amount, unit, remarks) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [uniqueID, item_id, item_name, 0, quantity, formattedDate, 0, unit, remarks]
        );

        await connection.commit();

        return NextResponse.json({ 
            message: "Data inserted successfully", 
            cred: { order_id: uniqueID, item_id, item_name, quantity, date: formattedDate, time, unit, remarks } 
        });
    } catch (err: any) {
        await connection.rollback();
        console.error("Database Error:", err);
        return NextResponse.json({ error: err.message });
    } finally {
        await connection.release();
    }
}
