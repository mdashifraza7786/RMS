import { dbConnect, getMenuById } from '@/database/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();
    const { item_name, item_description, item_foodtype, item_price, item_type , item_thumbnail } = data;

    let foodType: string;
    switch (item_foodtype) {
        case "veg":
            foodType = "VEG";
            break;
        case "nveg":
            foodType = "NVEG";
            break;
        default:
            return NextResponse.json({ message: "Contact Developer" });
    }

    function generateFourDigitRandomNumber(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }

    async function generateUniqueFoodId(): Promise<string> {
        let uniqueID: string;
        let foodExists: boolean;

        do {
            uniqueID = `${foodType}${generateFourDigitRandomNumber()}`;
            const food = await getMenuById(uniqueID);
            foodExists = !!food;
        } while (foodExists);

        return uniqueID;
    }

    const connection = await dbConnect();
    try {
        const uniqueID = await generateUniqueFoodId();
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
