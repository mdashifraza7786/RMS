import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { orderID: string } }) {
  const { tablenumber, paymentmethod, discount } = await request.json();
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
    
    // Calculate discount amount if provided
    let discountAmount = 0;
    let discountTypeValue = null;
    
    if (discount && discount.value > 0) {
      discountAmount = discount.value;
      discountTypeValue = discount.type;
    }
    
    // Update invoice with ONLY the columns shown in the image
    const updateInvoiceQuery = `
      UPDATE invoices 
      SET payment_status = ?, 
          payment_method = ?, 
          discount = ?, 
          discount_type = ?
      WHERE orderid = ?
    `;
    
    const invoiceValues = [
      "paid", 
      paymentmethod, 
      discountAmount,
      discountTypeValue,
      orderID
    ];
    
    await connection.query(updateInvoiceQuery, invoiceValues);
    
    // Update order status
    const updateOrderQuery = "UPDATE orders SET status = ?, end_time = NOW() WHERE id = ?";
    const orderValues = ["completed", orderID];
    await connection.query(updateOrderQuery, orderValues);

    // Update table availability
    const tableUpdate = "UPDATE tables SET availability = ? WHERE tablenumber = ?";
    const tableUpdateValues = [0, tablenumber];
    await connection.query(tableUpdate, tableUpdateValues);
    
    await connection.commit();
    return NextResponse.json({
      success: true,
      message: "Order Completed",
      discount: discount ? {
        amount: discountAmount,
        type: discountTypeValue
      } : null
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error completing order:", error);
    return NextResponse.json(
      { success: false, message: "Order Completion failed" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
