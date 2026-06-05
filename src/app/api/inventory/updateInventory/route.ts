import { NextResponse } from "next/server";
import { updateInventory } from "@/database";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

export const PUT = withErrorHandling(async (request: Request) => {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "admin" && userRole !== "chef")) {
        return NextResponse.json(errorResponse("Unauthorized: Admin or Chef only"), { status: 403 });
    }

    const data = await request.json();
    await updateInventory(data);

    return NextResponse.json(successResponse(null, "Inventory updated successfully"));
});
