import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { OrderRequestBody } from "../route";

export async function POST(
  request: Request,
  { params }: { params: { orderID: string } }
) {
  const { gst, items, subtotal, totalAmount }: OrderRequestBody =
    await request.json();

  const connection = await dbConnect();
  const orderID = Number(params.orderID);

  try {
    await connection.beginTransaction();

    const [existingOrder]: any = await connection.query(
      `SELECT order_items FROM orders WHERE id = ? LIMIT 1`,
      [orderID]
    );

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const existingItems = JSON.parse(existingOrder[0].order_items);
    const updatedItems = [...existingItems, ...items];
    const updatedItemsString = JSON.stringify(updatedItems);

    await connection.query(`UPDATE orders SET order_items = ? WHERE id = ?`, [
      updatedItemsString,
      orderID,
    ]);

    await connection.query(
      `UPDATE invoices 
         SET subtotal = ?, 
             gst = ?, 
             total_amount = ? 
         WHERE orderid = ?`,
      [subtotal, gst, totalAmount, orderID]
    );

    await connection.commit();
    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Transaction Error:", error);
    return NextResponse.json(
      { success: false, error: "Transaction failed" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
