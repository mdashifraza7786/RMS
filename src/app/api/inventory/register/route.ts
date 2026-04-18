import { dbConnect } from '@/database';
import { NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/api-handler';
import { successResponse } from '@/lib/api-response';

export const POST = withErrorHandling(async (request: Request) => {
    const data = await request.json();
    const { item_name, current_stock, low_limit, unit } = data;

    const connection = await dbConnect();

    function generateFiveDigitRandomNumber(): number {
        return Math.floor(10000 + Math.random() * 90000); 
    }

    async function generateUniqueItemId(): Promise<string> {
        let uniqueID: string;
        let itemExists: boolean;

        do {
            uniqueID = `ITEM${generateFiveDigitRandomNumber()}`;
            const [rows]: any = await connection.query('SELECT 1 FROM inventory WHERE item_id = ? LIMIT 1', [uniqueID]);
            itemExists = rows.length > 0;
        } while (itemExists);

        return uniqueID;
    }

    const uniqueID = await generateUniqueItemId();
    try {
        await connection.beginTransaction();

        await connection.query(`
            INSERT INTO inventory (item_id, item_name, current_stock, low_limit, unit) 
            VALUES (?, ?, ?, ?, ?)`, 
            [uniqueID, item_name, current_stock, low_limit, unit]
        );

        await connection.commit();

        return NextResponse.json(successResponse({ 
            uniqueID, item_name, current_stock, low_limit, unit 
        }, "Item registered successfully"));
    } catch (err: any) {
        await connection.rollback();
        throw err;
    } finally {
        await connection.release();
    }
});
