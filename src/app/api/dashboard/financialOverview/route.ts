import { NextResponse } from 'next/server';
import { getFinancialOverview } from '@/database/database';

export async function GET(request: Request) {
  try {
    // Get period from query parameter or default to 7 days
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '7days';
    
    // Get financial overview data from database utility
    const financialData = await getFinancialOverview(period);
    
    return NextResponse.json(financialData);
  } catch (error) {
    console.error("Error fetching financial overview data:", error);
    return NextResponse.json({ error: "Failed to fetch financial overview data" }, { status: 500 });
  }
} 