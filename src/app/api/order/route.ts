import { getTableOrders} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const order = await getTableOrders();

    return NextResponse.json(order);
}
