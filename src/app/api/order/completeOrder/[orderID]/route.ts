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
    
    // Fetch invoice details to apply discount
    const [invoiceDetails]: any = await connection.query(
      "SELECT subtotal FROM invoices WHERE orderid = ? LIMIT 1",
      [orderID]
    );
    
    if (invoiceDetails.length === 0) {
      return NextResponse.json({ success: false, message: "Invoice not found." });
    }
    
    const subtotal = parseFloat(invoiceDetails[0].subtotal);
    let discountAmount = 0;
    
    // Calculate discount if provided
    if (discount && discount.value > 0) {
      if (discount.type === "flat") {
        discountAmount = discount.value;
      } else {
        // Percentage discount
        discountAmount = (discount.value / 100) * subtotal;
      }
      
      // Ensure discount doesn't exceed subtotal
      discountAmount = Math.min(discountAmount, subtotal);
    }
    
    const discountedSubtotal = subtotal - discountAmount;
    const gst = discountedSubtotal * 0.18;
    const totalAmount = discountedSubtotal + gst;
    
    // Update invoice with discount information
    const updateInvoiceQuery = `
      UPDATE invoices 
      SET payment_status = ?, 
          payment_method = ?, 
          discount_amount = ?, 
          discount_type = ?, 
          discount_value = ?,
          total_after_discount = ?,
          gst_amount = ?,
          final_amount = ?
      WHERE orderid = ?
    `;
    
    const invoiceValues = [
      "paid", 
      paymentmethod, 
      discountAmount, 
      discount ? discount.type : null,
      discount ? discount.value : null,
      discountedSubtotal,
      gst,
      totalAmount,
      orderID
    ];
    
    await connection.query(updateInvoiceQuery, invoiceValues);
    
    const updateOrderQuery = "UPDATE orders SET status = ?, end_time = NOW() WHERE id = ?";
    const orderValues = ["completed", orderID];
    await connection.query(updateOrderQuery, orderValues);

    const tableUpdate = "UPDATE tables SET availability = ? WHERE tablenumber = ?";
    const tableUpdateValues = [0, tablenumber];
    await connection.query(tableUpdate, tableUpdateValues);
    
    await connection.commit();
    return NextResponse.json({
      success: true,
      message: "Order Completed",
      discount: discount ? {
        amount: discountAmount,
        type: discount.type,
        value: discount.value
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
