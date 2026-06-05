import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json(errorResponse("Forbidden: admin only"), { status: 403 });
  }

  const { orderid, waiterid } = await request.json();
  if (!orderid || !waiterid) {
    return NextResponse.json(errorResponse("orderid and waiterid are required"), { status: 400 });
  }

  const connection = await dbConnect();
  try {
    await connection.beginTransaction();
    await connection.query("UPDATE orders SET waiter_id = ? WHERE id = ?", [waiterid, orderid]);
    await connection.commit();
    return NextResponse.json(successResponse(null, "Waiter assigned successfully"));
  } catch (e) {
    await connection.rollback();
    return NextResponse.json(errorResponse("Failed to assign waiter"), { status: 500 });
  } finally {
    await connection.release();
  }
}
