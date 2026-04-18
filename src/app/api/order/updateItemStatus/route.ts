import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const POST = withErrorHandling(async (request: Request) => {
  const { orderid, itemid, status } = await request.json();
  if (!orderid || !itemid || !status) {
    return NextResponse.json(errorResponse("orderid, itemid, status required"), { status: 400 });
  }

  const connection = await dbConnect();
  try {
    await connection.beginTransaction();

    // 1. UPDATE RELATIONAL TABLE (Source of Truth)
    await connection.query(
        "UPDATE order_items SET status = ? WHERE order_id = ? AND item_id = ?",
        [status, orderid, itemid]
    );

    // 2. UPDATE KITCHEN ORDER QUEUE
    await connection.query(
        "UPDATE kitchen_order SET status = ? WHERE order_id = ? AND item_id = ? AND status != 'voided'",
        [status, orderid, itemid]
    );

    // 3. SYNC LEGACY JSON COLUMN (Consistency)
    const [rows]: any = await connection.query("SELECT order_items FROM orders WHERE id = ? LIMIT 1", [orderid]);
    if (rows.length > 0) {
      const items = JSON.parse(rows[0].order_items || "[]");
      const updated = items.map((it: any) => (it.item_id === itemid ? { ...it, status } : it));
      await connection.query("UPDATE orders SET order_items = ? WHERE id = ?", [JSON.stringify(updated), orderid]);
    }

    await connection.commit();
    return NextResponse.json(successResponse(null, "Status updated successfully"));
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    await connection.release();
  }
});


