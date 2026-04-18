import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const POST = withErrorHandling(async (request: Request, { params }: { params: Promise<{ orderID: string }> }) => {
  const { tablenumber, paymentmethod, discount } = await request.json();
  const { orderID: orderIDParam } = await params;
  const orderID = Number(orderIDParam);
  const connection = await dbConnect();

  try {
    await connection.beginTransaction();
    
    const [existingOrder]: any = await connection.query(
      `SELECT i.payment_status, o.table_id 
       FROM invoices i 
       JOIN orders o ON i.orderid = o.id 
       WHERE i.orderid = ? LIMIT 1 FOR UPDATE`,
      [orderID]
    );
    
    if (existingOrder.length === 0) {
      return NextResponse.json(errorResponse("Invoice not found"), { status: 404 });
    }

    const orderData = existingOrder[0];
    const tableIdFromDb = orderData.table_id;
    
    if (orderData.payment_status === "paid") {
      return NextResponse.json(errorResponse("The invoice has already been paid."));
    }
    
    let discountAmount = 0;
    let discountTypeValue = 'none';
    
    if (discount && discount.value > 0) {
      discountAmount = discount.value;
      discountTypeValue = discount.type || 'direct';
    }
    
    // Update invoice (Finalize Payment)
    const updateInvoiceQuery = `
      UPDATE invoices 
      SET payment_status = 'paid', 
          payment_method = ?, 
          discount = ?, 
          discount_type = ?,
          total_amount = subtotal + gst - ?
      WHERE orderid = ?
    `;
    
    await connection.query(updateInvoiceQuery, [paymentmethod, discountAmount, discountTypeValue, discountAmount, orderID]);
    
    // Update order status
    await connection.query("UPDATE orders SET status = 'completed', end_time = NOW() WHERE id = ?", [orderID]);

    // Release table (Source of Truth verified)
    await connection.query("UPDATE tables SET availability = 0 WHERE tablenumber = ?", [tableIdFromDb]);
    
    await connection.commit();
    return NextResponse.json(successResponse(null, "Payment Processed. Order Completed."));
    
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(errorResponse(error.message || "Completion failed"), { status: 500 });
  } finally {
    await connection.release();
  }
});
