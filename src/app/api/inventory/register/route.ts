import { dbConnect, getInventoryById } from '@/database/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();
    const { item_name, current_stock, low_limit, unit } = data;

    function generateFiveDigitRandomNumber(): number {
        return Math.floor(10000 + Math.random() * 90000); 
    }

    async function generateUniqueItemId(): Promise<string> {
        let uniqueID: string;
        let userExists: boolean;

        do {
            uniqueID = `ITEM${generateFiveDigitRandomNumber()}`;
            const user = await getInventoryById(uniqueID);
            userExists = !!user;
        } while (userExists);

        return uniqueID;
    }

    const uniqueID = await generateUniqueItemId(); 

    const connection = await dbConnect();
    try {
        await connection.beginTransaction();

        // Insert into inventory table
        await connection.query(`
            INSERT INTO inventory (item_id, item_name, current_stock, low_limit, unit) 
            VALUES (?, ?, ?, ?, ?)`, 
            [uniqueID, item_name, current_stock, low_limit, unit]
        );

        await connection.commit();

        return NextResponse.json({ 
            message: "Data inserted successfully", 
            cred: { uniqueID, item_name, current_stock, low_limit, unit } 
        });
    } catch (err: any) {
        await connection.rollback();
        return NextResponse.json({ error: err.message });
    } finally {
        await connection.end();
    }
}
