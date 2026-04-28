import { NextResponse } from 'next/server';
import { getFinancialOverview } from '@/database';
import { withErrorHandling } from '@/lib/api-handler';
import { successResponse } from '@/lib/api-response';

// Add export config to mark this route as dynamic
export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(async (request: Request) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'today';
    
    const result = await getFinancialOverview(period);
    
    if (!result.success) {
        throw new Error(result.message);
    }
    
    return NextResponse.json(successResponse(result.data));
});