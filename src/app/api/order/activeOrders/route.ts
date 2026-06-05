import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const GET = withErrorHandling(async (request: Request) => {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const sessionRole = (session.user as any)?.role as string;
  const sessionUserid = (session.user as any)?.userid as string;

  // Admins may request any role view via ?role=, staff always see their own data
  const { searchParams } = new URL(request.url);
  const requestedRole = searchParams.get("role");

  let effectiveRole: string;
  let effectiveUserid: string | null;

  if (sessionRole === 'admin') {
    effectiveRole = requestedRole || 'admin';
    effectiveUserid = searchParams.get("userid") || null;
  } else {
    // Non-admin: ignore query params, always use their own session identity
    effectiveRole = sessionRole;
    effectiveUserid = sessionUserid;
  }

  const connection = await dbConnect();

  try {
    const baseQuery = `
      SELECT o.id as orderId, o.table_id as tableNumber,
             o.waiter_id, u1.name AS waiter_name,
             o.chef_id,   u2.name AS chef_name,
             o.start_time, i.subtotal, i.gst, i.total_amount
      FROM orders o
      JOIN invoices i ON o.id = i.orderid
      LEFT JOIN user u1 ON o.waiter_id = u1.userid
      LEFT JOIN user u2 ON o.chef_id = u2.userid
      WHERE o.status NOT IN ('completed', 'cancelled')
    `;

    let rows: any;
    if (effectiveRole === 'waiter') {
      [rows] = await connection.query(`${baseQuery} AND o.waiter_id = ?`, [effectiveUserid]);
    } else if (effectiveRole === 'chef') {
      [rows] = await connection.query(`${baseQuery} AND o.chef_id = ?`, [effectiveUserid]);
    } else if (effectiveRole === 'admin') {
      [rows] = await connection.query(baseQuery);
    } else {
      return NextResponse.json(errorResponse("Invalid role"), { status: 403 });
    }

    const safeRows: any[] = Array.isArray(rows) ? rows : [];

    if (safeRows.length === 0) {
      return NextResponse.json(successResponse([]));
    }

    // Batch-fetch all items in one query instead of N+1
    const orderIds = safeRows.map((r: any) => r.orderId);
    const [allItems]: any = await connection.query(
      "SELECT id, order_id, item_id, item_name, quantity, price, status FROM order_items WHERE order_id IN (?) AND status != 'voided'",
      [orderIds]
    );

    const itemsByOrder = (allItems as any[]).reduce((acc: any, item: any) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {});

    const result = safeRows.map((row: any) => ({
      orderId: row.orderId,
      tableNumber: Number(row.tableNumber),
      waiter_id: row.waiter_id || null,
      waiter_name: row.waiter_name || null,
      chef_id: row.chef_id || null,
      chef_name: row.chef_name || null,
      billing: {
        subtotal: Number(row.subtotal),
        gst: Number(row.gst),
        total: Number(row.total_amount),
      },
      itemsordered: itemsByOrder[row.orderId] || [],
      // Pass raw ISO string so consumers can format or compute dates as needed
      start_time: row.start_time ? new Date(row.start_time).toISOString() : null,
    }));

    return NextResponse.json(successResponse(result));
  } finally {
    await connection.release();
  }
});
