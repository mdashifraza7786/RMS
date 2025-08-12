import { NextResponse } from "next/server";
import { getCustomerByMobile } from "@/database/database";

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();
    if (!mobile) return NextResponse.json({ exists: false }, { status: 400 });

    const customer = await getCustomerByMobile(mobile);

    return NextResponse.json({ exists: !!customer });
  } catch (e: any) {
    return NextResponse.json({ exists: false, message: e?.message || "Error" }, { status: 500 });
  }
}


