import { getRecentPayments} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const payments = await getRecentPayments();

    return NextResponse.json(payments);
}