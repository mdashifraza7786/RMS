import { getInvoice} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const order = await getInvoice();

    return NextResponse.json(order);
}
