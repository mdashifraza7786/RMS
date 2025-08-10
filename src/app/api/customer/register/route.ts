import { NextResponse } from "next/server";
import { createCustomer, getCustomerByMobile } from "@/database/database";

export async function POST(request: Request) {
  try {
    const { name, mobile, age, gender } = await request.json();
    if (!name || !mobile) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }
    const existing = await getCustomerByMobile(mobile);
    if (existing) {
      return NextResponse.json({ success: true, message: "Already exists" });
    }
    const customer = await createCustomer(name, mobile, age, gender);
    return NextResponse.json({ success: true, customer });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}


