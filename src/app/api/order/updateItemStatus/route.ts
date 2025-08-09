import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orderid, itemid, status } = await request.json();
  if (!orderid || !itemid || !status) {
    return NextResponse.json({ success: false, message: "orderid, itemid, status required" }, { status: 400 });
  }
  const connection = await dbConnect();
  try {
    await connection.beginTransaction();
    const [rows]: any = await connection.query("SELECT order_items FROM orders WHERE id = ? LIMIT 1", [orderid]);
    if (!rows || rows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    const items = JSON.parse(rows[0].order_items || "[]");
    const updated = items.map((it: any) => (it.item_id === itemid ? { ...it, status } : it));
    await connection.query("UPDATE orders SET order_items = ? WHERE id = ?", [JSON.stringify(updated), orderid]);
    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (e) {
    await connection.rollback();
    return NextResponse.json({ success: false, message: "Failed to update item status" }, { status: 500 });
  } finally {
    await connection.end();
  }
}


