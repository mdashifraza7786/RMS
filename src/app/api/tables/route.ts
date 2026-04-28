import { dbConnect, getTables } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { addTableSchema } from "@/lib/validation";

export const GET = withErrorHandling(async () => {
  const result = await getTables();
  if (!result.success) throw new Error(result.message);
  return NextResponse.json(successResponse(result.data));
});

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  const { tablenumber } = addTableSchema.parse(body);
  const availability = 0;

  const connection = await dbConnect();
  try {
    await connection.beginTransaction();

    const [tables]: any = await connection.query(
      `INSERT INTO tables (tablenumber, availability) VALUES (?, ?)`,
      [tablenumber, availability]
    );

    await connection.commit();
    return NextResponse.json(successResponse({ id: tables.insertId, tablenumber }));
  } catch (err: any) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
});
