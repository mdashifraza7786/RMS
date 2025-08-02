import { payPayout} from "@/database/database"; 
import { NextResponse } from "next/server";

export async function POST(request: Request){   
    const data = await request.json();
    const payout = await payPayout(data);

    return NextResponse.json(payout);
}
