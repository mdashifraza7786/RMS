import { createBulkInventoryOrders, getInventoryOrderById } from '@/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { orders } = await request.json();
        
        function generateFiveDigitRandomNumber(): number {
            return 10000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 90000);
        }

        const ordersWithIds = await Promise.all(orders.map(async (order: any) => {
            let uniqueID: string;
            let orderExists: boolean;
            do {
                uniqueID = `ORDER${generateFiveDigitRandomNumber()}`;
                const existing = await getInventoryOrderById(uniqueID);
                orderExists = !!existing;
            } while (orderExists);

            return {
                ...order,
                order_id: uniqueID,
                date: new Date().toISOString().split('T')[0]
            };
        }));

        const result = await createBulkInventoryOrders(ordersWithIds);
        
        if (result.success) {
            return NextResponse.json({ message: "Orders created successfully", count: orders.length });
        } else {
            return NextResponse.json({ error: result.message }, { status: 500 });
        }
    } catch (err: any) {
        console.error("Bulk Order Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
