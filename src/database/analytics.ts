import { getCache, setCache } from '@/lib/cache';
import { RowDataPacket } from 'mysql2/promise';
import dbConnect from './connection';
import { DbResponse } from '../types';

/** Local YYYY-MM-DD string — avoids UTC shift from toISOString(). */
const localDateStr = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

export async function getTotalRevenue(startDate: string, endDate: string): Promise<number> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(
            `SELECT COALESCE(SUM(total_amount), 0) AS total_revenue
             FROM invoices
             WHERE payment_status = 'paid'
               AND DATE(generated_at) BETWEEN ? AND ?`,
            [startDate, endDate]
        );
        return Number(rows[0]?.total_revenue || 0);
    } finally {
        await connection.release();
    }
}

export async function getOrdersCount(startDate: string, endDate: string): Promise<number> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(
            `SELECT COUNT(*) AS count
             FROM invoices
             WHERE payment_status = 'paid'
               AND DATE(generated_at) BETWEEN ? AND ?`,
            [startDate, endDate]
        );
        return Number(rows[0]?.count || 0);
    } finally {
        await connection.release();
    }
}

export async function getFinancialOverview(period: string): Promise<DbResponse<any>> {
    const cacheKey = `finance_overview_${period}`;
    const cached = getCache(cacheKey);
    if (cached) return { success: true, data: cached };

    try {
        const now = new Date();
        let startDate = new Date(now);
        let endDate   = new Date(now);

        switch (period) {
            case 'today':     break;
            case 'yesterday':
                startDate.setDate(now.getDate() - 1);
                endDate.setDate(now.getDate() - 1);
                break;
            case '7days':
                startDate.setDate(now.getDate() - 6);
                break;
            case '30days':
                startDate.setDate(now.getDate() - 29);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'all':
                startDate = new Date(2000, 0, 1);
                break;
            default:
                startDate.setDate(now.getDate() - 6);
        }

        const startDateStr = localDateStr(startDate);
        const endDateStr   = localDateStr(endDate);

        const revenue          = await getTotalRevenue(startDateStr, endDateStr);
        const ordersCount      = await getOrdersCount(startDateStr, endDateStr);
        const averageOrderValue = ordersCount > 0 ? revenue / ordersCount : 0;

        const result = {
            revenue:           { value: revenue },
            orders:            { value: ordersCount },
            averageOrderValue: { value: averageOrderValue },
            period,
        };

        setCache(cacheKey, result, 30);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching financial overview:', error);
        return { success: false, message: 'Failed to fetch financial data' };
    }
}
