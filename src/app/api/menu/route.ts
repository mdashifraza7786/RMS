import { getMenu} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const menu = await getMenu();

    return NextResponse.json(menu);
}
