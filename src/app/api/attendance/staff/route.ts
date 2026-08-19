import { dbConnect } from "@/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionRole = (session.user as any)?.role as string | undefined;
  const sessionUserid = (session.user as any)?.userid as string | undefined;
  const isAdmin = sessionRole === "admin";

  const { searchParams } = new URL(request.url);
  const requestedUserid = searchParams.get("userid") || undefined;
  if (!isAdmin && requestedUserid && requestedUserid !== sessionUserid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const targetUserid = isAdmin ? requestedUserid : sessionUserid;
  if (!targetUserid) {
    return NextResponse.json({ message: "userid required" }, { status: 400 });
  }
  const connection = await dbConnect();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT userid, name, role, status,
              DATE_FORMAT(date, '%Y-%m-%d') as date, time
       FROM attendance
       WHERE userid = ?
       ORDER BY date DESC, time DESC`,
      [targetUserid]
    );
    return NextResponse.json({ data: rows });
  } catch (e) {
    return NextResponse.json({ message: "Failed to fetch attendance" }, { status: 500 });
  } finally {
    await connection.release();
  }
}
