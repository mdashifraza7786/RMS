import { getAccount } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: Request, { params }: { params: Promise<{ userid: string }> }) {
    const { userid } = await params;

    if (!userid) {
        return NextResponse.json(errorResponse("User ID is required"), { status: 400 });
    }

    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const sessionRole = (session.user as any)?.role;
    const sessionUserid = (session.user as any)?.userid;
    if (sessionRole !== "admin" && sessionUserid !== userid) {
        return NextResponse.json(errorResponse("Forbidden: Access denied"), { status: 403 });
    }

    const result = await getAccount(userid);

    if (!result.success || !result.data) {
        return NextResponse.json(errorResponse("User not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(result.data));
}
