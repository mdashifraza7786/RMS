import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { orderID: string } }) {
  const { tablenumber,paymentmethod } = await request.json();
  const orderID = Number(params.orderID);
  const connection = await dbConnect();

  try {
    await connection.beginTransaction();
    
    const [existingOrder]: any = await connection.query(
      "SELECT payment_status FROM invoices WHERE orderid = ? LIMIT 1",
      [orderID]
    );
    
    if (existingOrder.length > 0 && existingOrder[0].payment_status === "paid") {
      return NextResponse.json({ success: false, message: "The invoice has already been paid." });
    }
    
    const updateInvoiceQuery = "UPDATE invoices SET payment_status = ?, payment_method = ? WHERE orderid = ?";
    const invoiceValues = ["paid",paymentmethod, orderID];
    await connection.query(updateInvoiceQuery, invoiceValues);
    
    const updateOrderQuery = "UPDATE orders SET status = ?, end_time = NOW() WHERE id = ?";
    const orderValues = ["completed", orderID];
    await connection.query(updateOrderQuery, orderValues);

    const tableUpdate = "UPDATE tables SET availability = ? WHERE tablenumber = ?";
    const tableUpdateValues = [0,tablenumber];
    await connection.query(tableUpdate, tableUpdateValues);
    
    await connection.commit();
    return NextResponse.json({
      success: true,
      message: "Order Completed",
    });
  } catch (error) {
    await connection.rollback();
    return NextResponse.json(
      { success: false, message: "Order Completion failed" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }

  return NextResponse.json({ success: true });
}
