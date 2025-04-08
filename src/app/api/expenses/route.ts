import { getExpenses } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const expenses = await getExpenses();
        return NextResponse.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
    }
}