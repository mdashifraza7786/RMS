import { getAccount, getUserByUserid } from "@/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ userid: string }> }) {
    const { userid } = await params;

    if (!userid) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const session: any = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role: sessionRole, userid: sessionUserid } = session.user;
    if (sessionRole !== "admin" && sessionUserid !== userid) {
        return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const member = await getUserByUserid(userid);

    if (!member) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await getAccount(userid);

    return NextResponse.json({
        member,
        payout_details: result.data,
    });
}
