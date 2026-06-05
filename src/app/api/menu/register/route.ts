import { dbConnect } from '@/database';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { registerMenuItemSchema } from '@/lib/validation';

export async function POST(request: Request) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    if (!session || userRole !== 'admin') {
        return NextResponse.json(errorResponse("Unauthorized"), { status: 403 });
    }

    const body = await request.json();
    const validation = registerMenuItemSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            errorResponse("Invalid input: " + JSON.stringify(validation.error.format())),
            { status: 400 }
        );
    }

    const { item_name, item_description, item_foodtype, item_price, making_cost, item_type, item_thumbnail } = validation.data;

    let foodType: string;
    switch (item_foodtype) {
        case "veg":
            foodType = "VEG";
            break;
        case "nveg":
            foodType = "NVEG";
            break;
        default:
            return NextResponse.json(errorResponse("Invalid food type. Must be 'veg' or 'nveg'"), { status: 400 });
    }

    function generateFourDigitRandomNumber(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }

    async function generateUniqueFoodId(): Promise<string> {
        let uniqueID: string;
        let foodExists: boolean;

        do {
            uniqueID = `${foodType}${generateFourDigitRandomNumber()}`;
            const [rows]: any = await connection.query('SELECT 1 FROM menu WHERE item_id = ? LIMIT 1', [uniqueID]);
            foodExists = rows.length > 0;
        } while (foodExists);

        return uniqueID;
    }

    const connection = await dbConnect();
    try {
        const uniqueID = await generateUniqueFoodId();
        await connection.beginTransaction();

        // Insert into menu table
        const [userResult] = await connection.query(`
            INSERT INTO menu (item_id, item_description, item_name, item_foodtype, item_price,making_cost, item_thumbnail, item_type) 
            VALUES (?, ?, ?, ?, ?,?, ?, ?)
        `, [
            uniqueID, 
            item_description, 
            item_name, 
            item_foodtype, 
            item_price, 
            making_cost,
            item_thumbnail, 
            item_type
        ]);

        await connection.commit();

        return NextResponse.json(successResponse({ uniqueID }, "Menu item registered successfully"), { status: 201 });
    } catch (err: any) {
        await connection.rollback();
        return NextResponse.json(errorResponse(err.message || "Failed to register menu item"), { status: 500 });
    } finally {
        connection.release();
    }
}
