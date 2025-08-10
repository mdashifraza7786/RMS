import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { mobile, name, password } = await request.json();
  if (!mobile || !password) {
    return NextResponse.json({ message: "mobile and password required" }, { status: 400 });
  }

  const connection = await dbConnect();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT id, name, mobile, password FROM customer WHERE mobile = ? ORDER BY id DESC LIMIT 1`,
      [mobile]
    );

    if (rows.length > 0) {
      const record: any = rows[0];
      const existingHash = record.password as string | null | undefined;

      if (!existingHash) {
        const hash = await bcrypt.hash(String(password), 10);
        await connection.query(`UPDATE customer SET password = ? WHERE id = ?`, [hash, record.id]);
        return NextResponse.json({ customer: { id: record.id, name: record.name ?? name ?? '', mobile: String(mobile) } });
      }

      const ok = await bcrypt.compare(String(password), String(existingHash));
      if (!ok) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
      }
      return NextResponse.json({ customer: { id: record.id, name: record.name ?? '', mobile: String(mobile) } });
    }

    const hash = await bcrypt.hash(String(password), 10);
    const [result]: any = await connection.query(
      `INSERT INTO customer (order_id, name, mobile, password, total_people) VALUES (?, ?, ?, ?, 1)`,
      ['', name ?? '', mobile, hash]
    );
    return NextResponse.json({ customer: { id: result.insertId, name: name ?? '', mobile: String(mobile) } });
  } catch (error) {
    console.error('Customer login error:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  } finally {
    await (connection as any).end();
  }
}


