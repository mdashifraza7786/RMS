import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const POST = withErrorHandling(async (request: Request, { params }: { params: Promise<{ orderID: string }> }) => {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    
    if (!session || userRole !== "admin") {
        return NextResponse.json(errorResponse("Unauthorized: Admins only"), { status: 403 });
    }

    const { orderID: orderIDParam } = await params;
    const orderID = Number(orderIDParam);
    const connection = await dbConnect();

    try {
        await connection.beginTransaction();

        // 1. Get Order Details
        const [orders]: any = await connection.query(
            "SELECT status, table_id FROM orders WHERE id = ? FOR UPDATE",
            [orderID]
        );

        if (orders.length === 0) {
            return NextResponse.json(errorResponse("Order not found"), { status: 404 });
        }

        if (orders[0].status === 'cancelled') {
            return NextResponse.json(errorResponse("Order is already voided"));
        }

        // 2. RESTORE STOCK (Crucial for Data Integrity)
        const [items]: any = await connection.query(
            "SELECT item_id, quantity FROM order_items WHERE order_id = ?",
            [orderID]
        );

        for (const item of items) {
            // Find ingredients for this item
            const [ingredients]: any = await connection.query(
                "SELECT inventory_item_id, quantity_required FROM menu_item_ingredients WHERE menu_item_id = ?",
                [item.item_id]
            );

            for (const ing of ingredients) {
                const amountToRestore = Number(ing.quantity_required) * Number(item.quantity);
                await connection.query(
                    "UPDATE inventory SET current_stock = current_stock + ? WHERE item_id = ?",
                    [amountToRestore, ing.inventory_item_id]
                );
            }
        }

        // 3. Mark as Cancelled
        await connection.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderID]);
        await connection.query("UPDATE invoices SET payment_status = 'failed' WHERE orderid = ?", [orderID]);
        
        // 4. Release Table
        await connection.query("UPDATE tables SET availability = 0 WHERE tablenumber = ?", [orders[0].table_id]);

        await connection.commit();
        return NextResponse.json(successResponse(null, "Order Voided and Inventory Restored"));

    } catch (error: any) {
        await connection.rollback();
        return NextResponse.json(errorResponse(error.message || "Void failed"), { status: 500 });
    } finally {
        await connection.release();
    }
});
