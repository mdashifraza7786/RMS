import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orderid, chefid } = await request.json();
  if (!orderid || !chefid) {
    return NextResponse.json(
      { success: false, message: "orderid and chefid are required" },
      { status: 400 }
    );
  }

  const connection = await dbConnect();
  try {
    await connection.beginTransaction();
    await connection.query("UPDATE orders SET chef_id = ? WHERE id = ?", [chefid, orderid]);
    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (e) {
    await connection.rollback();
    return NextResponse.json(
      { success: false, message: "Failed to assign chef" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}


