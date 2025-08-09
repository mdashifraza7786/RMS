import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const userid = searchParams.get("userid") || null;
  const connection = await dbConnect();
  let rows: any;

  if (role === 'waiter') {
    [rows] = await connection.query(
      `SELECT o.*, i.subtotal, i.gst, i.total_amount, u1.name AS waiter_name, u2.name AS chef_name
         FROM orders o
         JOIN invoices i ON o.id = i.orderid
         LEFT JOIN user u1 ON o.waiter_id = u1.userid
         LEFT JOIN user u2 ON o.chef_id = u2.userid
        WHERE o.status != ? AND o.waiter_id = ?`,
      ["completed", userid]
    );
  } else if (role === 'chef') {
    [rows] = await connection.query(
      `SELECT o.*, i.subtotal, i.gst, i.total_amount, u1.name AS waiter_name, u2.name AS chef_name
         FROM orders o
         JOIN invoices i ON o.id = i.orderid
         LEFT JOIN user u1 ON o.waiter_id = u1.userid
         LEFT JOIN user u2 ON o.chef_id = u2.userid
        WHERE o.status != ? AND o.chef_id = ?`,
      ["completed", userid]
    );
  } else {
    [rows] = await connection.query(
      `SELECT o.*, i.subtotal, i.gst, i.total_amount, u1.name AS waiter_name, u2.name AS chef_name
         FROM orders o
         JOIN invoices i ON o.id = i.orderid
         LEFT JOIN user u1 ON o.waiter_id = u1.userid
         LEFT JOIN user u2 ON o.chef_id = u2.userid
        WHERE o.status != ?`,
      ["completed"]
    );
  }

  const fullOrderDetails = rows.map((row: RowDataPacket) => ({
    orderId: row.id,
    billing: {
      subtotal: Number(row.subtotal),
    },
    tableNumber: Number(row.table_id),
    orderItems: JSON.parse(row.order_items),
    waiter_name: row.waiter_name || null,
    chef_name: row.chef_name || null,
    start_time: row.start_time ? new Date(row.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
  }));

  return NextResponse.json(fullOrderDetails);
}
