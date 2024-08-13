import { getAccount, getMembers } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(){
    const member = await getMembers();

    return NextResponse.json(member);
    

}