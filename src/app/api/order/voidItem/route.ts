import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const POST = withErrorHandling(async (request: Request) => {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    
    // Line-item voiding usually requires Admin/Chef or Waiter (if not yet paid)
    if (!session || !['admin', 'waiter'].includes(userRole)) {
        return NextResponse.json(errorResponse("Unauthorized"), { status: 403 });
    }

    const { order_item_id } = await request.json();

    if (!order_item_id) {
        return NextResponse.json(errorResponse("Missing order_item_id"), { status: 400 });
    }

    const connection = await dbConnect();

    try {
        await connection.beginTransaction();

        // 1. Fetch Item Details
        const [items]: any = await connection.query(
            `SELECT oi.*, i.payment_status 
             FROM order_items oi
             JOIN invoices i ON oi.order_id = i.orderid
             WHERE oi.id = ? FOR UPDATE`,
            [order_item_id]
        );

        if (items.length === 0) {
            return NextResponse.json(errorResponse("Item not found"), { status: 404 });
        }

        const item = items[0];

        if (item.status === 'voided') {
            return NextResponse.json(errorResponse("Item already voided"));
        }

        if (item.payment_status === 'paid') {
            return NextResponse.json(errorResponse("Cannot void items from a paid invoice"), { status: 400 });
        }

        // 2. Mark as Voided in relational table
        await connection.query(
            "UPDATE order_items SET status = 'voided' WHERE id = ?",
            [order_item_id]
        );

        // 3. Update Kitchen Order (Cancel it for the chef)
        // We look for a pending entry in kitchen_order for this specific item and order
        await connection.query(
            "UPDATE kitchen_order SET status = 'voided' WHERE order_id = ? AND item_id = ? AND status = 'pending' LIMIT 1",
            [item.order_id, item.item_id]
        );

        // 4. RESTORE STOCK (Reverse Recipe)
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

        // 5. RECALCULATE INVOICE
        const itemTotal = Number(item.price) * Number(item.quantity);
        const gstRate = 0.18; 
        const removedGst = itemTotal * gstRate;
        const removedTotal = itemTotal + removedGst;

        await connection.query(
            `UPDATE invoices 
             SET subtotal = subtotal - ?, 
                 gst = gst - ?, 
                 total_amount = total_amount - ? 
             WHERE orderid = ?`,
            [itemTotal, removedGst, removedTotal, item.order_id]
        );

        // 6. SYNC LEGACY JSON COLUMN (Consistency Assurance)
        const [orderRow]: any = await connection.query("SELECT order_items FROM orders WHERE id = ?", [item.order_id]);
        if (orderRow.length > 0) {
            let legacyItems = JSON.parse(orderRow[0].order_items);
            // In the legacy model, we usually just reduce quantity or remove the item
            // Here we'll reduce the quantity or remove it entirely if it matches
            const itemIdx = legacyItems.findIndex((li: any) => li.item_id === item.item_id);
            if (itemIdx > -1) {
                if (legacyItems[itemIdx].quantity <= item.quantity) {
                    legacyItems.splice(itemIdx, 1);
                } else {
                    legacyItems[itemIdx].quantity -= item.quantity;
                }
                await connection.query("UPDATE orders SET order_items = ? WHERE id = ?", [JSON.stringify(legacyItems), item.order_id]);
            }
        }

        await connection.commit();
        return NextResponse.json(successResponse(null, "Line-item voided successfully"));

    } catch (error: any) {
        await connection.rollback();
        return NextResponse.json(errorResponse(error.message || "Void failed"), { status: 500 });
    } finally {
        await connection.release();
    }
});
