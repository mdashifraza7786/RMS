import { dbConnect } from '@/database';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { registerExpenseSchema } from '@/lib/validation';
import crypto from 'crypto';
import { withErrorHandling } from '@/lib/api-handler';
import { successResponse } from '@/lib/api-response';

export const POST = withErrorHandling(async (request: Request) => {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    
    if (!session || !['admin', 'manager'].includes(userRole)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validation = registerExpenseSchema.safeParse(body);
    
    if (!validation.success) {
        return NextResponse.json({ 
            success: false, 
            message: "Invalid input", 
            errors: validation.error.issues.map(e => e.message) 
        }, { status: 400 });
    }

    const { expenses_for, frequency, cost } = validation.data;
    const connection = await dbConnect();

    try {
        await connection.beginTransaction();

        const uniqueID = `EXP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        await connection.query(`
            INSERT INTO expenses (id, expenses_for, frequency, cost, date) 
            VALUES (?, ?, ?, ?, ?)`, 
            [uniqueID, expenses_for, frequency, cost, currentDate]
        );

        await connection.commit();

        return NextResponse.json(successResponse({ 
            id: uniqueID, expenses_for, cost, date: currentDate 
        }, "Expense registered successfully"));
    } catch (dbErr) {
        await connection.rollback();
        throw dbErr;
    } finally {
        await connection.release();
    }
});
