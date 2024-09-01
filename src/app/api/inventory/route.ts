import { getInventory} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const inventory = await getInventory();

    return NextResponse.json(inventory);
}
