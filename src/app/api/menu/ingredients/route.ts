import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

// GET mapping for a specific menu item
export const GET = withErrorHandling(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get("menuId");

    if (!menuId) {
        return NextResponse.json({ success: false, message: "Menu ID required" }, { status: 400 });
    }

    const connection = await dbConnect();
    try {
        const [rows]: any = await connection.query(
            `SELECT m.*, i.item_name, i.unit 
             FROM menu_item_ingredients m
             JOIN inventory i ON m.inventory_item_id = i.item_id
             WHERE m.menu_item_id = ?`,
            [menuId]
        );

        return NextResponse.json(successResponse(rows));
    } finally {
        await connection.release();
    }
});

// POST link a new ingredient
export const POST = withErrorHandling(async (request: Request) => {
    const { menu_item_id, inventory_item_id, quantity_required } = await request.json();

    if (!menu_item_id || !inventory_item_id || !quantity_required) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const connection = await dbConnect();
    try {
        // Prevent duplicates
        const [exists]: any = await connection.query(
            "SELECT id FROM menu_item_ingredients WHERE menu_item_id = ? AND inventory_item_id = ?",
            [menu_item_id, inventory_item_id]
        );

        if (exists.length > 0) {
           return NextResponse.json({ success: false, message: "This ingredient is already mapped to this item." }, { status: 400 });
        }

        const [result]: any = await connection.query(
            "INSERT INTO menu_item_ingredients (menu_item_id, inventory_item_id, quantity_required) VALUES (?, ?, ?)",
            [menu_item_id, inventory_item_id, quantity_required]
        );

        return NextResponse.json(successResponse({ id: result.insertId }, "Ingredient mapped successfully"));
    } finally {
        await connection.release();
    }
});

// DELETE a mapping
export const DELETE = withErrorHandling(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ success: false, message: "Mapping ID required" }, { status: 400 });
    }

    const connection = await dbConnect();
    try {
        await connection.query("DELETE FROM menu_item_ingredients WHERE id = ?", [id]);
        return NextResponse.json(successResponse(null, "Ingredient removed"));
    } finally {
        await connection.release();
    }
});
