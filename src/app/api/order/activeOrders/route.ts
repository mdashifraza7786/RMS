import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const userid = searchParams.get("userid") || null;
  const connection = await dbConnect();
  
  try {
    let rows: any;

    const baseQuery = `
      SELECT o.id as orderId, o.table_id as tableNumber, u1.name AS waiter_name, u2.name AS chef_name, 
             o.start_time, i.subtotal, i.gst, i.total_amount, o.chef_id
      FROM orders o
      JOIN invoices i ON o.id = i.orderid
      LEFT JOIN user u1 ON o.waiter_id = u1.userid
      LEFT JOIN user u2 ON o.chef_id = u2.userid
      WHERE o.status NOT IN ('completed', 'cancelled')
    `;

    if (role === 'waiter') {
      [rows] = await connection.query(`${baseQuery} AND o.waiter_id = ?`, [userid]);
    } else if (role === 'chef') {
      [rows] = await connection.query(`${baseQuery} AND o.chef_id = ?`, [userid]);
    } else if (role === 'admin') {
      [rows] = await connection.query(baseQuery);
    } else {
      return NextResponse.json(errorResponse("Unauthorized role"), { status: 403 });
    }

    const fullOrderDetails = await Promise.all(rows.map(async (row: any) => {
      const [items]: any = await connection.query(
        "SELECT id, item_id, item_name, quantity, price FROM order_items WHERE order_id = ? AND status != 'voided'",
        [row.orderId]
      );

      return {
        orderId: row.orderId,
        tableNumber: Number(row.tableNumber),
        waiter_name: row.waiter_name || null,
        chef_name: row.chef_name || null,
        chef_id: row.chef_id || null,
        billing: {
          subtotal: Number(row.subtotal),
          gst: Number(row.gst),
          total: Number(row.total_amount)
        },
        itemsordered: items,
        start_time: row.start_time ? new Date(row.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      };
    }));

    return NextResponse.json(successResponse(fullOrderDetails));
  } finally {
    await connection.release();
  }
});
