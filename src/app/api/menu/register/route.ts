import { dbConnect } from '@/database/database';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const data = await request.json();
    const { item_description, item_name, item_foodtype, item_price, item_thumbnail, item_type } = data;

    // Generate a unique ID using UUID
    const uniqueID = uuidv4();

    const connection = await dbConnect();
    try {
        await connection.beginTransaction();

        // Insert into menu table
        const [userResult] = await connection.query(`
            INSERT INTO menu (item_id, item_description, item_name, item_foodtype, item_price, item_thumbnail, item_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            uniqueID, 
            item_description, 
            item_name, 
            item_foodtype, 
            item_price, 
            item_thumbnail, 
            item_type
        ]);

        await connection.commit();

        return NextResponse.json({ message: "Data inserted successfully", cred: { uniqueID } });
    } catch (err: any) {
        await connection.rollback();
        return NextResponse.json({ error: err.message });
    } finally {
        connection.end();
    }
}
