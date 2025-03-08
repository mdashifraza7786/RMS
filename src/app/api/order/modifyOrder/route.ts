import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { orderid, itemid }: { orderid: number; itemid: string } = await request.json();
  const connection = await dbConnect();

  try {
    await connection.beginTransaction();

    const [order]: any = await connection.query(
      "SELECT order_items FROM orders WHERE id = ? LIMIT 1",
      [orderid]
    );

    if (order.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    let items = JSON.parse(order[0].order_items);

    const updatedItems = items.filter((item: any) => item.item_id !== itemid);

    const subtotal = updatedItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const gst = +(subtotal * 0.18).toFixed(2); 
    const totalAmount = subtotal + gst;

    await connection.query(
      "UPDATE orders SET order_items = ? WHERE id = ?",
      [JSON.stringify(updatedItems), orderid]
    );

    await connection.query(
      "UPDATE invoices SET subtotal = ?, gst = ?, total_amount = ? WHERE orderid = ?",
      [subtotal, gst, totalAmount, orderid]
    );

    await connection.commit();
    return NextResponse.json({ success: true, message: "Item removed & invoice updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: "Failed to remove item & update invoice" }, { status: 500 });
  } finally {
    await connection.end();
  }
}
