import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mobile = searchParams.get("mobile");
  if (!mobile) return NextResponse.json({ orders: [] });

  const connection = await dbConnect();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT o.id as orderId, o.table_id, i.subtotal, i.gst, i.total_amount, i.payment_status, o.order_items, o.status, o.start_time, o.end_time
       FROM orders o
       JOIN invoices i ON o.id = i.orderid
       LEFT JOIN customer c ON o.id = c.order_id
       WHERE c.mobile = ?
       ORDER BY o.id DESC`,
      [mobile]
    );
    const orders = (rows as any[]).map(r => ({
      orderId: r.orderId,
      billing: { subtotal: Number(r.subtotal), gst: Number(r.gst), totalAmount: Number(r.total_amount) },
      status: r.status,
      tableNumber: Number(r.table_id),
      items: (typeof r.order_items === 'string' ? JSON.parse(r.order_items) : r.order_items).map((it: any) => ({
        ...it,
        status: it.status || 'pending'
      })),
      start_time: r.start_time,
      end_time: r.end_time,
      payment_status: r.payment_status,
    }));
    return NextResponse.json({ orders });
  } catch (e: any) {
    return NextResponse.json({ orders: [] }, { status: 500 });
  } finally {
    await connection.end();
  }
}


