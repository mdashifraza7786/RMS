import { dbConnect, getTables } from "@/database";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { addTableSchema } from "@/lib/validation";

import { auth } from "@/auth";
import { getSettingsByType } from "@/database";

export const GET = withErrorHandling(async () => {
  const result = await getTables();
  if (!result.success) throw new Error(result.message);

  let tables = result.data || [];
  
  // Filter by waiter zones if enabled
  const session = await auth();
  const role = (session?.user as any)?.role;
  const userid = (session?.user as any)?.userid;

  if (role === 'waiter') {
    const settingsResult = await getSettingsByType('general');
    const zonesEnabled = settingsResult.data?.waiter_zones_enabled === 'true';

    if (zonesEnabled) {
      tables = tables.filter((table: any) => table.assigned_waiter_id === userid);
    }
  }

  return NextResponse.json(successResponse(tables));
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
