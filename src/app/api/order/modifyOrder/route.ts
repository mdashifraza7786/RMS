import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { RowDataPacket } from "mysql2/promise";

export const POST = withErrorHandling(async (request: Request) => {
  const { orderid, itemid, tablenumber }: { orderid: number; itemid: string, tablenumber: number } = await request.json();
  const connection = await dbConnect();

  try {
    await connection.beginTransaction();

    // Fetch GST rate from settings (default to 0.18)
    const [settings]: any = await connection.query<RowDataPacket[]>(
      "SELECT setting_value FROM settings WHERE setting_key = 'gst_rate' LIMIT 1"
    );
    const gstRate = settings.length > 0 ? parseFloat(settings[0].setting_value) : 0.18;

    const [order]: any = await connection.query(
      "SELECT order_items FROM orders WHERE id = ? LIMIT 1",
      [orderid]
    );

    if (order.length === 0) {
      throw new Error("Order not found");
    }

    let items = JSON.parse(order[0].order_items);
    const updatedItems = items.filter((item: any) => item.item_id !== itemid);

    const subtotal = updatedItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const gst = +(subtotal * gstRate).toFixed(2); 
    const totalAmount = subtotal + gst;

    if (totalAmount === 0) {
      await connection.query("DELETE FROM orders WHERE id = ?", [orderid]);
      await connection.query("DELETE FROM invoices WHERE orderid = ?", [orderid]);
      await connection.query("UPDATE tables SET availability = 0 WHERE tablenumber = ?", [tablenumber]);
      await connection.commit();
      return NextResponse.json(successResponse({ deleted: true, message: "Item removed & order deleted successfully" }));
    } else {
      await connection.query(
        "UPDATE orders SET order_items = ? WHERE id = ?",
        [JSON.stringify(updatedItems), orderid]
      );
  
      await connection.query(
        "UPDATE invoices SET subtotal = ?, gst = ?, total_amount = ? WHERE orderid = ?",
        [subtotal, gst, totalAmount, orderid]
      );
  
      await connection.commit();
      return NextResponse.json(successResponse({ deleted: false, message: "Item removed & invoice updated successfully" }));
    }
    
  } catch (error: any) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
});
