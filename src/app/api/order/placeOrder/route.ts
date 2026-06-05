import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { placeOrderSchema } from "@/lib/validation";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";
import { GST_RATE } from "@/lib/constants";

type OrderItem = { item_id: string; item_name: string; quantity: number; price: number };

async function insertItemsIntoOrder(connection: any, orderId: number, items: OrderItem[]) {
  for (const item of items) {
    await connection.query(
      `INSERT INTO order_items (order_id, item_id, item_name, quantity, price, status) VALUES (?, ?, ?, ?, ?, 'pending')`,
      [orderId, item.item_id, item.item_name, item.quantity, item.price]
    );
    await connection.query(
      `INSERT INTO kitchen_order (order_id, item_id, item_name, quantity, status, unit, date, time, remarks) VALUES (?, ?, ?, ?, 'pending', 'pieces', CURDATE(), CURTIME(), 'No special instructions')`,
      [orderId, item.item_id, item.item_name, item.quantity]
    );
  }
}

export const POST = withErrorHandling(async (request: Request) => {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  if (!session || !['waiter', 'admin'].includes(userRole)) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 403 });
  }

  const body = await request.json();
  const validation = placeOrderSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(errorResponse("Invalid input: " + JSON.stringify(validation.error.format())), { status: 400 });
  }

  const { items, tableNumber } = validation.data;
  const userid = session.user?.id || (session.user as any)?.userid;

  const connection = await dbConnect();

  try {
    await connection.beginTransaction();

    // 1. Verify prices server-side (zero-trust)
    const [prices]: any = await connection.query(
      "SELECT item_id, item_price FROM menu WHERE item_id IN (?)",
      [items.map((i) => i.item_id)]
    );

    const priceMap = new Map<string, number>(prices.map((p: any) => [String(p.item_id), Number(p.item_price)]));
    let serverSubtotal = 0;

    // Build verified items with server prices (never trust client-supplied prices)
    const verifiedItems: OrderItem[] = items.map((item) => {
      const serverPrice = priceMap.get(item.item_id);
      if (serverPrice === undefined) {
        throw new Error(`Menu item ${item.item_id} not found`);
      }
      serverSubtotal += serverPrice * item.quantity;
      return { item_id: item.item_id, item_name: item.item_name, quantity: item.quantity, price: serverPrice };
    });

    const serverGst = serverSubtotal * GST_RATE;
    const serverTotal = serverSubtotal + serverGst;

    // 2. Check for active table session
    const [activeOrders]: any = await connection.query(
      `SELECT id FROM orders WHERE table_id = ? AND status != 'completed' LIMIT 1 FOR UPDATE`,
      [tableNumber]
    );

    let orderId: number;
    let isNewOrder = false;

    if (activeOrders.length > 0) {
      orderId = activeOrders[0].id;
      await connection.query(
        `UPDATE invoices SET subtotal = subtotal + ?, gst = gst + ?, total_amount = total_amount + ? WHERE orderid = ?`,
        [serverSubtotal, serverGst, serverTotal, orderId]
      );
      await insertItemsIntoOrder(connection, orderId, verifiedItems);
    } else {
      isNewOrder = true;
      const [order]: any = await connection.query(
        `INSERT INTO orders (table_id, waiter_id, status, order_items) VALUES (?, ?, 'ordered', ?)`,
        [tableNumber, userid, JSON.stringify(verifiedItems)]
      );
      orderId = order.insertId;

      await connection.query(
        `INSERT INTO invoices (orderid, table_id, subtotal, gst, total_amount, payment_status, discount_type, generated_at) VALUES (?, ?, ?, ?, ?, 'pending', 'none', NOW())`,
        [orderId, tableNumber, serverSubtotal, serverGst, serverTotal]
      );

      await insertItemsIntoOrder(connection, orderId, verifiedItems);

      await connection.query(
        `UPDATE tables SET availability = '1' WHERE tablenumber = ?`,
        [tableNumber]
      );
    }

    // 3. Deduct ingredients from inventory
    const menuItemIds = verifiedItems.map((i) => i.item_id);
    const [ingredients]: any = await connection.query(
      `SELECT menu_item_id, inventory_item_id, quantity_required FROM menu_item_ingredients WHERE menu_item_id IN (?)`,
      [menuItemIds]
    );

    if (ingredients.length > 0) {
      const dailyDeductions: Record<string, number> = {};
      for (const item of verifiedItems) {
        const itemIngs = ingredients.filter((ing: any) => ing.menu_item_id === item.item_id);
        for (const ing of itemIngs) {
          const totalNeeded = Number(ing.quantity_required) * Number(item.quantity);
          dailyDeductions[ing.inventory_item_id] = (dailyDeductions[ing.inventory_item_id] || 0) + totalNeeded;
        }
      }

      const invIds = Object.keys(dailyDeductions);
      await connection.query("SELECT item_id, current_stock FROM inventory WHERE item_id IN (?) FOR UPDATE", [invIds]);

      for (const [invId, amount] of Object.entries(dailyDeductions)) {
        const [result]: any = await connection.query(
          `UPDATE inventory SET current_stock = current_stock - ? WHERE item_id = ? AND current_stock >= ?`,
          [amount, invId, amount]
        );
        if (result.affectedRows === 0) {
          throw new Error(`Insufficient stock for ${invId}. Order aborted.`);
        }
      }
    }

    await connection.commit();
    return NextResponse.json(successResponse({ orderId, merged: !isNewOrder }));
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      errorResponse(error.message || "Failed to place order"),
      { status: error.message?.includes('stock') ? 409 : 500 }
    );
  } finally {
    await connection.release();
  }
});
