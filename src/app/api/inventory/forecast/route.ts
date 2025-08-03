import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await dbConnect();
  
  try {
    // Fetch all data from the recent_inventory_order table
    const [rows] = await connection.query(
      `SELECT 
        order_id,
        order_name,
        price,
        quantity,
        date,
        total_amount,
        unit
      FROM recent_inventory_order
      ORDER BY date DESC`
    );
    
    return NextResponse.json({
      success: true,
      data: rows,
      message: "Inventory order history retrieved successfully"
    });
    
  } catch (error: any) {
    console.error("Error fetching inventory order history:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch inventory order history",
        error: error.message 
      },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}