import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnect from './connection';
import { Payout, PayoutDetails, DbResponse } from '../types';

export async function getPayout(page: number = 1, limit: number = 10): Promise<DbResponse<{ payouts: Payout[], total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        const [totalRows]: any = await connection.query(
            'SELECT COUNT(*) as total FROM payout'
        );
        const total = totalRows[0].total;

        const [payoutRows] = await connection.query<RowDataPacket[]>(
            'SELECT id,userid,account_number,upi_id,amount,status,date FROM payout ORDER BY date DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return { success: true, data: { payouts: payoutRows as Payout[], total: total as number } };
    } catch (error) {
        console.error('Error fetching payouts:', error);
        return { success: false, message: 'Failed to fetch payouts' };
    } finally {
        await connection.release();
    }
}

export async function getPayoutDetails(): Promise<DbResponse<PayoutDetails[]>> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT userid,account_name,account_number,ifsc_code,branch_name,upiid FROM payout_details'
        );
        return { success: true, data: rows as PayoutDetails[] };
    } catch (error) {
        console.error('Error fetching payout details:', error);
        return { success: false, message: 'Failed to fetch payout details' };
    } finally {
        await connection.release();
    }
}

export async function payPayout(id: number, status: string): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    try {
        await connection.query('UPDATE payout SET status = ? WHERE id = ?', [status, id]);
        return { success: true, message: 'Payout status updated' };
    } catch (error) {
        console.error('Error updating payout:', error);
        return { success: false, message: 'Failed to update payout' };
    } finally {
        await connection.release();
    }
}
