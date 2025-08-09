import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userid = searchParams.get("userid");
  if (!userid) {
    return NextResponse.json({ message: "userid required" }, { status: 400 });
  }
  const connection = await dbConnect();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT userid,name,role,status,date,time
       FROM attendance
       WHERE userid = ?
       ORDER BY date DESC, time DESC`,
      [userid]
    );
    return NextResponse.json({ data: rows });
  } catch (e) {
    return NextResponse.json({ message: "Failed to fetch attendance" }, { status: 500 });
  } finally {
    await connection.end();
  }
}
