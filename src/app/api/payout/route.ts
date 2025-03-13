import { getPayout} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const menu = await getPayout();

    return NextResponse.json(menu);
}
