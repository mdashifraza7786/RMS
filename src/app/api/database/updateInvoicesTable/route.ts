import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

// API endpoint to add discount columns to the invoices table
export async function GET() {
  const connection = await dbConnect();
  
  try {
    // Check if columns already exist
    const [columns]: any = await connection.query(
      "SHOW COLUMNS FROM invoices LIKE 'discount_amount'"
    );
    
    if (columns.length > 0) {
      return NextResponse.json({ success: true, message: "Columns already exist" });
    }
    
    // Add the necessary columns for discount information
    await connection.query(`
      ALTER TABLE invoices 
      ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN discount_type VARCHAR(20) DEFAULT NULL,
      ADD COLUMN discount_value DECIMAL(10,2) DEFAULT NULL,
      ADD COLUMN total_after_discount DECIMAL(10,2) DEFAULT NULL,
      ADD COLUMN gst_amount DECIMAL(10,2) DEFAULT NULL,
      ADD COLUMN final_amount DECIMAL(10,2) DEFAULT NULL
    `);
    
    return NextResponse.json({ 
      success: true, 
      message: "Successfully added discount columns to invoices table" 
    });
  } catch (error) {
    console.error("Error updating invoices table:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update invoices table" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
} 