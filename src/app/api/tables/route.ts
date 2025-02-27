import { dbConnect, getMenu, getTables } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET() {
  const tables = await getTables();

  return NextResponse.json(tables);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { tablenumber } = data;
  const availability = 0;

  const connection = await dbConnect();
  try {
    await connection.beginTransaction();

    const [tables] = await connection.query(
      `
            INSERT INTO tables (tablenumber,availability) 
            VALUES (?,?)
        `,
      [tablenumber, availability]
    );

    await connection.commit();

    return NextResponse.json(tables);
  } catch (err: any) {
    await connection.rollback();
    return NextResponse.json({ message: "Failed to add table" });
  } finally {
    connection.end();
  }

}
