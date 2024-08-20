import { getMenu} from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const member = await getMenu();

    return NextResponse.json(member);
}
