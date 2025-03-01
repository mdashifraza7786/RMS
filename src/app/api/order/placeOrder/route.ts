import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface OrderRequestBody {
    gst: number;
    items: OrderItem[]; 
    subtotal: number;
    tableNumber: number;
    totalAmount: number;
}

export async function POST(request: Request): Promise<NextResponse> {
    const { gst, items, subtotal, tableNumber, totalAmount }: OrderRequestBody = await request.json();
    const connection = await dbConnect();

    try {
        await connection.beginTransaction();

        const itemsString = JSON.stringify(items);

        const [order]: any = await connection.query(
            `INSERT INTO orders (table_id, order_items) VALUES (?, ?)`,
            [tableNumber, itemsString] 
        );

        const orderId = await order.insertId;

        await connection.query(
            `INSERT INTO invoices (orderid, table_id, subtotal, gst, total_amount) VALUES (?, ?, ?, ?, ?)`,
            [orderId, tableNumber, subtotal, gst, totalAmount]
        );

        await connection.query(
            `UPDATE tables SET availability = '1' WHERE tablenumber = ?`,
            [tableNumber]
        );

        await connection.commit();
        return NextResponse.json({ success: true, orderId: orderId });
    } catch (error) {
        await connection.rollback();
        console.error("Transaction Error:", error);
        return NextResponse.json({ success: false, error: "Transaction failed" }, { status: 500 });
    } finally {
        await connection.end();
    }
}
