import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';

export async function GET() {
  const connection = await dbConnect();

  try {
    const [menuRows] = await connection.execute(`
      SELECT item_id, item_name, item_price FROM menu
    `) as [any[], any];

    const menuMap: Record<string, { name: string; price: number }> = {};
    menuRows.forEach(item => {
      menuMap[item.item_id] = {
        name: item.item_name,
        price: item.item_price
      };
    });

    const [orders] = await connection.execute(`
      SELECT id, order_items FROM orders
    `) as [any[], any];

    for (const order of orders) {
      let items;
      try {
        items = JSON.parse(order.order_items);
      } catch (e) {
        console.error(`Invalid JSON in order ID ${order.id}`);
        continue;
      }

      let updated = false;
      const enriched = items.map((item: any) => {
        const menuItem = menuMap[item.item_id];
        if (menuItem && (!item.item_name || !item.price)) {
          updated = true;
          return {
            item_id: item.item_id,
            item_name: menuItem.name,
            quantity: 1,
            price: menuItem.price
          };
        }
        return item;
      });

      if (updated) {
        const newJson = JSON.stringify(enriched);
        await connection.execute(
          'UPDATE orders SET order_items = ? WHERE id = ?',
          [newJson, order.id]
        );
      }
    }

    await connection.end();
    
    return NextResponse.json({ success: true, message: "Orders enriched successfully" });
  } catch (error) {
    console.error("Error enriching orders:", error);
    await connection.end();
    return NextResponse.json({ success: false, error: "Failed to enrich orders" }, { status: 500 });
  }
}
