import { getAccount, getUserByUserid } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userid: string } }) {
    const { userid } = params;

    if (!userid) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const member = await getUserByUserid(userid);

    if (!member) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const payout_details = await getAccount(userid);

    return NextResponse.json({
        member,
        payout_details,
    });
}
