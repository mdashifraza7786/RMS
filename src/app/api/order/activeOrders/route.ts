import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const connection = await dbConnect();

  const [rows]: any = await connection.query(
    `SELECT orders.*, invoices.subtotal, invoices.gst, invoices.total_amount 
         FROM orders 
         JOIN invoices ON orders.id = invoices.orderid 
         WHERE orders.status != ?`,
    ["completed"]
  );


  const fullOrderDetails = rows.map((row: RowDataPacket) => ({
    orderId: row.id,
    billing: {
      subtotal: Number(row.subtotal),
    },
    tableNumber: Number(row.table_id),
    orderItems: JSON.parse(row.order_items),
    start_time: row.start_time ? new Date(row.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
  }));

  return NextResponse.json(fullOrderDetails);
}
