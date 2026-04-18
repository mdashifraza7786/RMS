import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";
import { RowDataPacket } from "mysql2";

export const POST = withErrorHandling(async (request: Request, { params }: { params: Promise<{ orderID: string }> }) => {
  const body = await request.json();
  const { items } = body; // We ignore client-provided totals for security
  const role = body.role || null;
  const userid = body.userid || null;
  const { orderID } = await params;
  const orderId = Number(orderID);

  if (!items || items.length === 0) {
    return NextResponse.json(errorResponse("No items to add"), { status: 400 });
  }

  const connection = await dbConnect();

  try {
    await connection.beginTransaction();

    // 1. Fetch current menu prices and ingredients (SOURCE OF TRUTH)
    const menuItemIds = items.map((i: any) => i.item_id);
    const [menuItems]: any = await connection.query(
      "SELECT item_id, item_price, item_name FROM menu WHERE item_id IN (?)",
      [menuItemIds]
    );

    let serverSubtotal = 0;
    const validatedItems = items.map((clientItem: any) => {
      const dbItem = menuItems.find((m: any) => m.item_id === clientItem.item_id);
      if (!dbItem) throw new Error(`Item ${clientItem.item_id} not found in menu`);
      
      const price = Number(dbItem.item_price);
      serverSubtotal += price * clientItem.quantity;
      
      return {
        ...clientItem,
        item_name: dbItem.item_name,
        price: price
      };
    });

    const serverGst = serverSubtotal * 0.18;
    const serverTotal = serverSubtotal + serverGst;

    // 2. Fetch existing order (Legacy Support)
    let existingOrderRows: any;
    if (role === 'waiter' && userid) {
        [existingOrderRows] = await connection.query(
            "SELECT order_items FROM orders WHERE id = ? AND waiter_id = ? LIMIT 1 FOR UPDATE",
            [orderId, userid]
        );
    } else {
        [existingOrderRows] = await connection.query(
            "SELECT order_items FROM orders WHERE id = ? LIMIT 1 FOR UPDATE",
            [orderId]
        );
    }

    if (existingOrderRows.length === 0) {
        throw new Error("Order not found or access denied");
    }

    let existingItems = JSON.parse(existingOrderRows[0].order_items);
    
    // Merge items for legacy JSON column
    validatedItems.forEach((newItem: any) => {
        const existing = existingItems.find((i: any) => i.item_id === newItem.item_id);
        if (existing) {
            existing.quantity += newItem.quantity;
        } else {
            existingItems.push({
                item_id: newItem.item_id,
                item_name: newItem.item_name,
                quantity: newItem.quantity,
                price: newItem.price
            });
        }
    });

    // 3. Update Tables
    await connection.query(
        "UPDATE orders SET order_items = ? WHERE id = ?",
        [JSON.stringify(existingItems), orderId]
    );

    await connection.query(
        "UPDATE invoices SET subtotal = subtotal + ?, gst = gst + ?, total_amount = total_amount + ? WHERE orderid = ?",
        [serverSubtotal, serverGst, serverTotal, orderId]
    );

    // 4. Sync relational tables and kitchen order
    for (const item of validatedItems) {
        // Relational recording
        await connection.query(
            `INSERT INTO order_items (order_id, item_id, item_name, quantity, price) VALUES (?, ?, ?, ?, ?)`,
            [orderId, item.item_id, item.item_name, item.quantity, item.price]
        );

        // Kitchen notify
        await connection.query(
            `INSERT INTO kitchen_order (order_id, item_id, item_name, quantity, status, unit, date, time, remarks) VALUES (?, ?, ?, ?, 'pending', 'pieces', CURDATE(), CURTIME(), 'Added to existing order')`,
            [orderId, item.item_id, item.item_name, item.quantity]
        );
    }

    // 5. STOCK DEDUCTION (Production Standard)
    const [ingredients]: any = await connection.query(
        `SELECT menu_item_id, inventory_item_id, quantity_required 
         FROM menu_item_ingredients 
         WHERE menu_item_id IN (?)`,
        [menuItemIds]
    );

    if (ingredients.length > 0) {
        const deductions: Record<string, number> = {};
        for (const item of validatedItems) {
            const itemIngs = ingredients.filter((ing: any) => ing.menu_item_id === item.item_id);
            for (const ing of itemIngs) {
                deductions[ing.inventory_item_id] = (deductions[ing.inventory_item_id] || 0) + (Number(ing.quantity_required) * item.quantity);
            }
        }

        const invIds = Object.keys(deductions);
        await connection.query("SELECT item_id, current_stock FROM inventory WHERE item_id IN (?) FOR UPDATE", [invIds]);

        for (const [invId, amount] of Object.entries(deductions)) {
            const [res]: any = await connection.query(
                "UPDATE inventory SET current_stock = current_stock - ? WHERE item_id = ? AND current_stock >= ?",
                [amount, invId, amount]
            );
            if (res.affectedRows === 0) throw new Error(`Insufficient stock for ${invId}`);
        }
    }

    await connection.commit();
    return NextResponse.json(successResponse({ orderId }, "Order updated successfully"));
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(errorResponse(error.message || "Failed to update order"), { status: error.message?.includes('stock') ? 409 : 500 });
  } finally {
    await connection.release();
  }
});
