import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mobile = searchParams.get("mobile");

  if (!mobile) {
    return NextResponse.json({ message: "mobile required" }, { status: 400 });
  }

  const connection = await dbConnect();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT 
         o.id AS order_id,
         o.order_items,
         o.start_time,
         o.end_time,
         o.status AS order_status,
         i.subtotal,
         i.gst,
         i.total_amount,
         i.payment_status,
         i.generated_at
       FROM orders o
       LEFT JOIN invoices i ON o.id = i.orderid
       LEFT JOIN customer c ON o.id = c.order_id
       WHERE c.mobile = ?
       ORDER BY o.id DESC`,
      [mobile]
    );

    return NextResponse.json({ orders: rows });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json({ message: "Failed to fetch customer orders" }, { status: 500 });
  } finally {
    await (connection as any).end();
  }
}


