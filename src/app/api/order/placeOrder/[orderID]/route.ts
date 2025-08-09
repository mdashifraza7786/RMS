import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { orderID: string } }
) {
  const body = await request.json();
  const { gst, items, subtotal, totalAmount } = body;
  const role = body.hasOwnProperty('role') ? body.role : null;
  const userid = body.hasOwnProperty('userid') ? body.userid : null;

  const connection = await dbConnect();
  const orderID = Number(params.orderID);

  try {
    await connection.beginTransaction();
    let existingOrder: any;
    if (role === 'waiter' && userid) {
      [existingOrder] = await connection.query(
        "SELECT order_items FROM orders WHERE id = ? AND waiter_id = ? LIMIT 1",
        [orderID, userid]
      );
    } else {
      [existingOrder] = await connection.query(
        "SELECT order_items FROM orders WHERE id = ? LIMIT 1",
        [orderID]
      );
    }

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    let existingItems = JSON.parse(existingOrder[0].order_items);

    items.forEach((newItem:any) => {
      const existingItem = existingItems.find(
        (item: any) => item.item_id === newItem.item_id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        existingItems.push(newItem);
      }
    });

    const updatedItemsString = JSON.stringify(existingItems);

    if (role === 'waiter' && userid) {
      await connection.query(
        "UPDATE orders SET order_items = ? WHERE id = ? AND waiter_id = ?",
        [updatedItemsString, orderID, userid]
      );
    } else {
      await connection.query(
        "UPDATE orders SET order_items = ? WHERE id = ?", 
        [updatedItemsString, orderID]
      );
    }

    await connection.query(
      "UPDATE invoices SET subtotal = ?, gst = ?, total_amount = ? WHERE orderid = ?",
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
