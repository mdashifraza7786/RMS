import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { placeOrderSchema } from "@/lib/validation";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";


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

  const { gst, items, subtotal, tableNumber, totalAmount } = validation.data;
  const userid = session.user?.id || (session.user as any)?.userid;

  const connection = await dbConnect();

  try {
    await connection.beginTransaction();

    // 1. Calculate Totals on Server (Zero-Trust Security)
    const [prices]: any = await connection.query(
        "SELECT item_id, item_price FROM menu WHERE item_id IN (?)",
        [items.map((i: any) => i.item_id)]
    );

    const priceMap = new Map(prices.map((p: any) => [p.item_id, p.item_price]));
    let serverSubtotal = 0;
    
    for (const item of items) {
        const price = priceMap.get(item.item_id);
        if (price === undefined) {
            throw new Error(`Menu item ${item.item_id} not found`);
        }
        serverSubtotal += Number(price) * Number(item.quantity);
    }

    const serverGst = serverSubtotal * 0.18; // Standard 18% GST
    const serverTotal = serverSubtotal + serverGst;

    // 2. Check for Active Table Session
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

      // Sync relational tables for the newly added items
      for (const item of items) {
        // Individual item relational recording
        await connection.query(
          `INSERT INTO order_items (order_id, item_id, item_name, quantity, price) VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.item_id, item.item_name, item.quantity, item.price]
        );

        // Kitchen Order insertion (to notify chefs)
        await connection.query(
          `INSERT INTO kitchen_order (order_id, item_id, item_name, quantity, status, unit, date, time, remarks) VALUES (?, ?, ?, ?, 'pending', 'pieces', CURDATE(), CURTIME(), 'No special instructions')`,
          [orderId, item.item_id, item.item_name, item.quantity]
        );
      }
    } else {
      isNewOrder = true;
      const [order]: any = await connection.query(
        `INSERT INTO orders (table_id, waiter_id, status, order_items) VALUES (?, ?, 'ordered', ?)`,
        [tableNumber, userid, JSON.stringify(items)]
      );
      orderId = order.insertId;

      // Create Invoice
      await connection.query(
        `INSERT INTO invoices (orderid, table_id, subtotal, gst, total_amount, payment_status, discount_type) VALUES (?, ?, ?, ?, ?, 'pending', 'none')`,
        [orderId, tableNumber, serverSubtotal, serverGst, serverTotal]
      );

      // Insert into relational order_items and kitchen_order
      for (const item of items) {
        // Individual item relational recording
        await connection.query(
          `INSERT INTO order_items (order_id, item_id, item_name, quantity, price) VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.item_id, item.item_name, item.quantity, item.price]
        );

        // Kitchen Order insertion (to notify chefs)
        await connection.query(
          `INSERT INTO kitchen_order (order_id, item_id, item_name, quantity, status, unit, date, time, remarks) VALUES (?, ?, ?, ?, 'pending', 'pieces', CURDATE(), CURTIME(), 'No special instructions')`,
          [orderId, item.item_id, item.item_name, item.quantity]
        );
      }

      await connection.query(
        `UPDATE tables SET availability = '1' WHERE tablenumber = ?`,
        [tableNumber]
      );
    }

    // 3. IMMEDIATE INGREDIENT DEDUCTION (Production Standard)
    const menuItemIds = items.map((i: any) => i.item_id);
    const [ingredients]: any = await connection.query(
      `SELECT menu_item_id, inventory_item_id, quantity_required 
       FROM menu_item_ingredients 
       WHERE menu_item_id IN (?)`,
      [menuItemIds]
    );

    if (ingredients.length > 0) {
      const dailyDeductions: Record<string, number> = {};
      for (const item of items) {
        const itemIngs = ingredients.filter((ing: any) => ing.menu_item_id === item.item_id);
        for (const ing of itemIngs) {
          const totalNeeded = Number(ing.quantity_required) * Number(item.quantity);
          dailyDeductions[ing.inventory_item_id] = (dailyDeductions[ing.inventory_item_id] || 0) + totalNeeded;
        }
      }

      const invIds = Object.keys(dailyDeductions);
      // Lock inventory
      await connection.query("SELECT item_id, current_stock FROM inventory WHERE item_id IN (?) FOR UPDATE", [invIds]);

      for (const [invId, amount] of Object.entries(dailyDeductions)) {
        const [result]: any = await connection.query(
          `UPDATE inventory 
           SET current_stock = current_stock - ? 
           WHERE item_id = ? AND current_stock >= ?`,
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
    return NextResponse.json(errorResponse(error.message || "Failed to place order"), { status: error.message?.includes('stock') ? 409 : 500 });
  } finally {
    await connection.release();
  }
});
