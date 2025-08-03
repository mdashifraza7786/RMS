import { NextResponse } from 'next/server';
import { getFinancialOverview } from '@/database/database';

// Add export config to mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get the period parameter from the URL search params
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'today';
    
    const financialData = await getFinancialOverview(period);
    
    return NextResponse.json(financialData);
  } catch (error) {
    console.error("Error fetching financial overview data:", error);
    return NextResponse.json({ error: "Failed to fetch financial overview data" }, { status: 500 });
  }
} 