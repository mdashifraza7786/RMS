import { dbConnect } from '@/database';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { registerMemberSchema } from '@/lib/validation';
import crypto from 'crypto';
import { checkRateLimit } from '@/utils/rateLimit';
import { withErrorHandling } from '@/lib/api-handler';
import { successResponse } from '@/lib/api-response';

export const POST = withErrorHandling(async (request: Request) => {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(`reg_${ip}`, 10, 60000).success) { // 10 per min
        return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    
    // RBAC: Only admin can register new members
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    
    // Validation
    const validation = registerMemberSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({ 
            success: false, 
            message: "Invalid input", 
            errors: validation.error.issues.map(e => e.message) 
        }, { status: 400 });
    }

    const { basicInfoFields, addressFields, payoutFields } = validation.data;

    let userPrefix: string;
    switch (basicInfoFields.role) {
        case "chef": userPrefix = "CH"; break;
        case "waiter": userPrefix = "WA"; break;
        case "washer": userPrefix = "WS"; break;
        case "admin": userPrefix = "AD"; break;
        default: userPrefix = "ST";
    }

    const connection = await dbConnect();

    try {
        await connection.beginTransaction();

    // Secure ID Generation
    const uniqueID = `${userPrefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

        // Secure Password Generation
        const password = crypto.randomBytes(8).toString('base64').slice(0, 12);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into users table
        await connection.query(`
            INSERT INTO user (userid, name, role, photo, mobile, email, password, aadhaar, pancard) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            uniqueID, 
            basicInfoFields.name, 
            basicInfoFields.role, 
            basicInfoFields.photo, 
            basicInfoFields.phone_number, 
            basicInfoFields.email, 
            hashedPassword, 
            basicInfoFields.aadhar_no, 
            basicInfoFields.pan_no
        ]);

        // Insert into user_address
        await connection.query(`
            INSERT INTO user_address (userid, street_or_house_no, landmark, address_one, address_two, city, state, pin, country) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            uniqueID, 
            addressFields.street_or_house_no, 
            addressFields.landmark, 
            addressFields.address_one, 
            addressFields.address_two, 
            addressFields.city, 
            addressFields.state, 
            addressFields.pin_code, 
            addressFields.country || 'India'
        ]);

        // Insert into payout_details
        await connection.query(`
            INSERT INTO payout_details (userid, account_name, account_number, ifsc_code, branch_name, upiid) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            uniqueID, 
            payoutFields.account_name, 
            payoutFields.account_number, 
            payoutFields.ifsc_code, 
            payoutFields.branch_name, 
            payoutFields.upiid
        ]);

        await connection.commit();

        return NextResponse.json(successResponse({ 
            userid: uniqueID, password 
        }, "Member registered successfully"));

    } catch (dbErr) {
        await connection.rollback();
        throw dbErr;
    } finally {
        connection.release();
    }
});
