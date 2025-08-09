import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRequestBody {
  gst: number;
  items: OrderItem[];
  subtotal: number;
  tableNumber: number;
  totalAmount: number;
  role?: string;
  userid?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const { gst, items, subtotal, tableNumber, totalAmount } = body;
  const role = body.hasOwnProperty('role') ? body.role : null;
  const userid = body.hasOwnProperty('userid') ? body.userid : null;
  const connection = await dbConnect();

  try {
    await connection.beginTransaction();

    const itemsString = JSON.stringify(items);
    let order: any;
    if (role === 'waiter' && userid) {
      [order] = await connection.query(
        `INSERT INTO orders (table_id, waiter_id, order_items) VALUES (?, ?, ?)`,
        [tableNumber, userid, itemsString]
      );
    } else {
      [order] = await connection.query(
        `INSERT INTO orders (table_id, order_items) VALUES (?, ?)`,
        [tableNumber, itemsString]
      );
    }

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
    return NextResponse.json(
      { success: false, error: "Transaction failed" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
