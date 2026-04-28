import { NextResponse } from "next/server";
import { dbConnect } from "@/database";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const DELETE = withErrorHandling(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  
  if (!session || userRole !== "admin") {
      return NextResponse.json(errorResponse("Unauthorized: Admins only"), { status: 403 });
  }
  const connection = await dbConnect();

  try {
    await connection.beginTransaction();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        errorResponse("Table ID is required"),
        { status: 400 }
      );
    }

    const query = `DELETE FROM tables WHERE id = ?`;
    const values = [id];
    const [result]: any = await connection.query(query, values);

    if (result.affectedRows === 0) {
        return NextResponse.json(errorResponse("Table not found"), { status: 404 });
    }

    await connection.commit();

    return NextResponse.json(successResponse(null, "Table deleted successfully"));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
});
