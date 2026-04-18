import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnect from './connection';
import { Expense, DbResponse } from '../types';

export async function getExpenses(page: number = 1, limit: number = 10): Promise<DbResponse<{ expenses: Expense[], total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        const [totalRows]: any = await connection.query(
            'SELECT COUNT(*) as total FROM expenses'
        );
        const total = totalRows[0].total;

        const [expenseRows] = await connection.query<RowDataPacket[]>(
            'SELECT id,expenses_for,frequency,cost,date FROM expenses ORDER BY date DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return { success: true, data: { expenses: expenseRows as Expense[], total } };
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return { success: false, message: 'Failed to fetch expenses' };
    } finally {
        await connection.release();
    }
}
