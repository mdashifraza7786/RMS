import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

interface OrderItem {
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { items, subtotal, gst, totalAmount, customerName, customerMobile } = body || {};

  if (!Array.isArray(items) || items.length === 0 || !customerMobile) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const connection = await dbConnect();
  try {
    await connection.beginTransaction();

    const itemsString = JSON.stringify(items);

    const [orderResult]: any = await connection.query(
      `INSERT INTO orders (order_items, status) VALUES (?, 'pending')`,
      [itemsString]
    );
    const orderId = orderResult.insertId;

    await connection.query(
      `INSERT INTO invoices (orderid, subtotal, gst, total_amount, payment_status) VALUES (?, ?, ?, ?, 'unpaid')`,
      [orderId, subtotal, gst, totalAmount]
    );

    // With current customer schema shape (order-level info), insert a record per order with basic info
    await connection.query(
      `INSERT INTO customer (order_id, name, mobile, total_people) VALUES (?, ?, ?, 1)`,
      [orderId, customerName || '', customerMobile]
    );

    await connection.commit();
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    await connection.rollback();
    console.error('Customer place order error:', error);
    return NextResponse.json({ message: 'Failed to place order' }, { status: 500 });
  } finally {
    await (connection as any).end();
  }
}


