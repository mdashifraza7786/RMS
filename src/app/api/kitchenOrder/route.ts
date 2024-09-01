import { getKitchenOrders} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const order = await getKitchenOrders();

    return NextResponse.json(order);
}
