import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

<<<<<<< HEAD
/*
Expected body:
{
  items: Array<{ item_id: string; item_name: string; price: number; quantity: number }>,
  mobile: string,
  name?: string,
  age?: number,
  gender?: string
}
*/

export async function POST(request: Request) {
  const { items, mobile, name, age, gender, tableNumber } = await request.json();
  if (!Array.isArray(items) || items.length === 0 || !mobile) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
=======
interface OrderItem {
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { items, subtotal, gst, totalAmount, customerName, customerMobile } = body || {};

  if (!Array.isArray(items) || items.length === 0 || !customerMobile) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
>>>>>>> 6bc30bd55c3a66646ab7ccb30df070cb664eb107
  }

  const connection = await dbConnect();
  try {
    await connection.beginTransaction();

<<<<<<< HEAD
    // 1) Check if customer already has an active (not completed) order
    const [activeRows]: any = await connection.query(
      `SELECT o.id AS order_id, o.order_items
       FROM customer c
       JOIN orders o ON c.order_id = o.id
       WHERE c.mobile = ? AND o.status != 'completed'
       ORDER BY o.id DESC
       LIMIT 1`,
      [mobile]
    );

    const mergeItems = (existingItems: any[], newItems: any[]) => {
      const next = [...existingItems];
      newItems.forEach((newItem: any) => {
        const idx = next.findIndex((it: any) => it.item_id === newItem.item_id);
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: Number(next[idx].quantity) + Number(newItem.quantity) };
        } else {
          next.push(newItem);
        }
      });
      return next;
    };

    if (Array.isArray(activeRows) && activeRows.length > 0) {
      // Update existing active order
      const orderId = activeRows[0].order_id as number;
      const existingItems = JSON.parse(activeRows[0].order_items || '[]');
      const updatedItems = mergeItems(existingItems, items);
      const itemsString = JSON.stringify(updatedItems);

      // Recalculate totals
      const subtotal = updatedItems.reduce((acc: number, it: any) => acc + Number(it.price) * Number(it.quantity), 0);
      const gst = Math.round(subtotal * 0.05);
      const totalAmount = subtotal + gst;

      await connection.query(`UPDATE orders SET order_items = ? WHERE id = ?`, [itemsString, orderId]);
      await connection.query(
        `UPDATE invoices SET subtotal = ?, gst = ?, total_amount = ? WHERE orderid = ?`,
        [subtotal, gst, totalAmount, orderId]
      );

      await connection.commit();
      return NextResponse.json({ success: true, orderId, updated: true });
    }

    // 2) No active order → create a new one (requires a table number)
    const table_id = Number(tableNumber) || 0;
    if (!table_id || table_id <= 0) {
      await connection.rollback();
      return NextResponse.json({ success: false, message: "Invalid table number" }, { status: 400 });
    }

    // Pick a present waiter today with the least active (not completed) orders
    const [waiterRows]: any = await connection.query(
      `SELECT u.userid AS waiter_id, COUNT(o.id) AS active_orders
       FROM user u
       JOIN attendance a ON a.userid = u.userid AND a.date = CURDATE() AND a.status = 'present'
       LEFT JOIN orders o ON o.waiter_id = u.userid AND o.status != 'completed'
       WHERE u.role = 'waiter'
       GROUP BY u.userid
       ORDER BY active_orders ASC, MIN(a.time) ASC
       LIMIT 1`
    );
    const waiterId = waiterRows?.[0]?.waiter_id;
    if (!waiterId) {
      await connection.rollback();
      return NextResponse.json({ success: false, message: "No waiter present today" }, { status: 400 });
    }
    const itemsString = JSON.stringify(items);
    const [order]: any = await connection.query(
      `INSERT INTO orders (table_id, waiter_id, order_items) VALUES (?, ?, ?)`,
      [table_id, waiterId, itemsString]
    );
    const orderId = order.insertId as number;

    const subtotal = items.reduce((acc: number, it: any) => acc + Number(it.price) * Number(it.quantity), 0);
    const gst = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + gst;

    await connection.query(
      `INSERT INTO invoices (orderid, table_id, subtotal, gst, total_amount) VALUES (?, ?, ?, ?, ?)`,
      [orderId, table_id, subtotal, gst, totalAmount]
    );

    // Mark table as occupied
    try {
      await connection.query(`UPDATE tables SET availability = '1' WHERE tablenumber = ?`, [table_id]);
    } catch (_) {}

    // 3) Upsert a single customer row for this mobile and set current order_id
    const [custRows]: any = await connection.query(`SELECT id FROM customer WHERE mobile = ? LIMIT 1`, [mobile]);
    if (Array.isArray(custRows) && custRows.length > 0) {
      const cid = custRows[0].id;
      await connection.query(
        `UPDATE customer SET order_id = ?, name = COALESCE(?, name), age = COALESCE(?, age), gender = COALESCE(?, gender) WHERE id = ?`,
        [orderId, name || null, age ?? null, gender ?? null, cid]
      );
    } else {
      await connection.query(
        `INSERT INTO customer (order_id, name, mobile, age, gender) VALUES (?, ?, ?, ?, ?)`,
        [orderId, name || null, mobile, age ?? null, gender ?? null]
      );
    }

    // waiter already assigned above

    await connection.commit();
    return NextResponse.json({ success: true, orderId, created: true });
  } catch (e: any) {
    await connection.rollback();
    console.error("/api/customer/placeOrder error:", e?.message || e);
    return NextResponse.json({ success: false, message: e?.message || "Failed to place/update order" }, { status: 500 });
  } finally {
    await connection.end();
=======
    const itemsString = JSON.stringify(items);

    const [orderResult]: any = await connection.query(
      `INSERT INTO orders (order_items, status) VALUES (?, 'pending')`,
      [itemsString]
    );
    const orderId = orderResult.insertId;

    await connection.query(
      `INSERT INTO invoices (orderid, subtotal, gst, total_amount, payment_status) VALUES (?, ?, ?, ?, 'unpaid')`,
      [orderId, subtotal, gst, totalAmount]
    );

    // With current customer schema shape (order-level info), insert a record per order with basic info
    await connection.query(
      `INSERT INTO customer (order_id, name, mobile, total_people) VALUES (?, ?, ?, 1)`,
      [orderId, customerName || '', customerMobile]
    );

    await connection.commit();
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    await connection.rollback();
    console.error('Customer place order error:', error);
    return NextResponse.json({ message: 'Failed to place order' }, { status: 500 });
  } finally {
    await (connection as any).end();
>>>>>>> 6bc30bd55c3a66646ab7ccb30df070cb664eb107
  }
}


