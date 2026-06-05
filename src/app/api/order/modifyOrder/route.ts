import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";
import { GST_RATE } from "@/lib/constants";

export const POST = withErrorHandling(async (request: Request) => {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  if (!session || !['admin', 'waiter'].includes(userRole)) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 403 });
  }

  const { orderid, itemid, tablenumber }: { orderid: number; itemid: string; tablenumber: number } = await request.json();

  if (!orderid || !itemid) {
    return NextResponse.json(errorResponse("Missing required fields"), { status: 400 });
  }

  const connection = await dbConnect();

  try {
    await connection.beginTransaction();

    // 1. Verify order exists and is not paid
    const [orders]: any = await connection.query(
      "SELECT o.id FROM orders o JOIN invoices i ON o.id = i.orderid WHERE o.id = ? AND i.payment_status != 'paid' LIMIT 1",
      [orderid]
    );

    if (orders.length === 0) {
      return NextResponse.json(errorResponse("Order not found or already paid"), { status: 404 });
    }

    // 2. Find the item in the relational order_items table
    const [items]: any = await connection.query(
      "SELECT * FROM order_items WHERE order_id = ? AND item_id = ? AND status != 'voided' LIMIT 1",
      [orderid, itemid]
    );

    if (items.length === 0) {
      return NextResponse.json(errorResponse("Item not found in order"), { status: 404 });
    }

    const item = items[0];

    // 3. Mark item as voided in relational table
    await connection.query(
      "UPDATE order_items SET status = 'voided' WHERE id = ?",
      [item.id]
    );

    // 4. Cancel in kitchen
    await connection.query(
      "UPDATE kitchen_order SET status = 'voided' WHERE order_id = ? AND item_id = ? AND status = 'pending' LIMIT 1",
      [orderid, itemid]
    );

    // 5. Restore inventory stock
    const [ingredients]: any = await connection.query(
      "SELECT inventory_item_id, quantity_required FROM menu_item_ingredients WHERE menu_item_id = ?",
      [itemid]
    );
    for (const ing of ingredients) {
      const amountToRestore = Number(ing.quantity_required) * Number(item.quantity);
      await connection.query(
        "UPDATE inventory SET current_stock = current_stock + ? WHERE item_id = ?",
        [amountToRestore, ing.inventory_item_id]
      );
    }

    // 6. Recalculate invoice from remaining active items
    const [remaining]: any = await connection.query(
      "SELECT price, quantity FROM order_items WHERE order_id = ? AND status != 'voided'",
      [orderid]
    );

    const subtotal = remaining.reduce((acc: number, r: any) => acc + Number(r.price) * Number(r.quantity), 0);
    const gst = +(subtotal * GST_RATE).toFixed(2);
    const totalAmount = subtotal + gst;

    if (totalAmount === 0) {
      await connection.query("DELETE FROM orders WHERE id = ?", [orderid]);
      await connection.query("DELETE FROM invoices WHERE orderid = ?", [orderid]);
      await connection.query("UPDATE tables SET availability = 0 WHERE tablenumber = ?", [tablenumber]);
      await connection.commit();
      return NextResponse.json(successResponse({ deleted: true, message: "Item removed & order deleted successfully" }));
    }

    await connection.query(
      "UPDATE invoices SET subtotal = ?, gst = ?, total_amount = ? WHERE orderid = ?",
      [subtotal, gst, totalAmount, orderid]
    );

    // 7. Sync legacy JSON column for historical consistency
    const [orderRow]: any = await connection.query("SELECT order_items FROM orders WHERE id = ?", [orderid]);
    if (orderRow.length > 0) {
      let legacyItems: any[];
      try {
        legacyItems = JSON.parse(orderRow[0].order_items);
      } catch {
        legacyItems = [];
      }
      const itemIdx = legacyItems.findIndex((li: any) => li.item_id === itemid);
      if (itemIdx > -1) {
        if (legacyItems[itemIdx].quantity <= item.quantity) {
          legacyItems.splice(itemIdx, 1);
        } else {
          legacyItems[itemIdx].quantity -= item.quantity;
        }
        await connection.query("UPDATE orders SET order_items = ? WHERE id = ?", [JSON.stringify(legacyItems), orderid]);
      }
    }

    await connection.commit();
    return NextResponse.json(successResponse({ deleted: false, message: "Item removed & invoice updated successfully" }));

  } catch (error: any) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
});
