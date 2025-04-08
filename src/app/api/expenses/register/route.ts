import { dbConnect, getInventoryById } from '@/database/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();
    const { expenses_for, frequency, cost } = data;

    function generateFiveDigitRandomNumber(): number {
        return Math.floor(10000 + Math.random() * 90000); 
    }

    async function generateUniqueItemId(): Promise<string> {
        let uniqueID: string;
        let userExists: boolean;

        do {
            uniqueID = `EXP${generateFiveDigitRandomNumber()}`;
            const user = await getInventoryById(uniqueID);
            userExists = !!user;
        } while (userExists);

        return uniqueID;
    }

    const uniqueID = await generateUniqueItemId(); 
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const connection = await dbConnect();
    try {
        await connection.beginTransaction();

        // Insert into expenses table
        await connection.query(`
            INSERT INTO expenses (id, expenses_for, frequency, cost, date) 
            VALUES (?, ?, ?, ?, ?)`, 
            [uniqueID, expenses_for, frequency, cost, currentDate]
        );

        await connection.commit();

        return NextResponse.json({ 
            message: "Data inserted successfully", 
            cred: { uniqueID, expenses_for, frequency, cost, date: currentDate } 
        });
    } catch (err: any) {
        await connection.rollback();
        console.error("Error inserting expense:", err.message);
        return NextResponse.json({ error: err.message });
    } finally {
        await connection.end();
    }
}
