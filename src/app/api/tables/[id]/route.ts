import { NextResponse } from "next/server";
import { dbConnect } from "@/database/database";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const connection = await dbConnect();

  try {
    await connection.beginTransaction();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Table ID is required" },
        { status: 400 }
      );
    }

    const query = `DELETE FROM tables WHERE id = ?`;
    const values = [id];
    const [result] = await connection.query(query, values);

    await connection.commit();

    return NextResponse.json(result);
  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ message: "Internal Server Error" },{ status: 500 });
  } finally {
    // Ensure the connection is closed
    await connection.end();
  }
}
