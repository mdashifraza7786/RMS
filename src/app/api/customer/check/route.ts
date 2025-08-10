import { NextResponse } from "next/server";
import { getCustomerByMobile } from "@/database/database";

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();
    if (!mobile) return NextResponse.json({ exists: false }, { status: 400 });

    const customer = await Promise.race<Promise<any>>([
      getCustomerByMobile(mobile),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)) as any,
    ]);

    return NextResponse.json({ exists: !!customer });
  } catch (e: any) {
    return NextResponse.json({ exists: false, message: e?.message || "Error" }, { status: 500 });
  }
}


