import { getRecentOrders} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const order = await getRecentOrders();

    return NextResponse.json(order);
}
