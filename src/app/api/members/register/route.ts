import { dbConnect, getUserByUserid } from '@/database/database';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
    const data = await request.json();
    const { basicInfoFields, addressFields, payoutFields } = data;
    
    let userType: string;
    switch (basicInfoFields.role) {
        case "chef":
            userType = "CH";
            break;
        case "waiter":
            userType = "WA";
            break;
        case "washer":
            userType = "WS";
            break;
        default:
            return NextResponse.json({ message: "Contact Developer" });
    }
    
    function generateFourDigitRandomNumber(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }
    
    async function generateUniqueUserId(): Promise<string> {
        let uniqueID: string;
        let userExists: boolean;
    
        do {
            uniqueID = `${userType}${generateFourDigitRandomNumber()}`;
            const user = await getUserByUserid(uniqueID);
            userExists = !!user;
        } while (userExists);
    
        return uniqueID;
    }
    
    const uniqueID = await generateUniqueUserId();
    
    function generatePassword(length: number): string {
        const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    
        const allChars = upperCaseChars + lowerCaseChars + numbers + specialChars;
        let password = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            password += allChars[randomIndex];
        }
    
        return password;
    }
    
    const password = generatePassword(6);
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const connection = await dbConnect();
    try {
        await connection.beginTransaction();

        // Insert into users table
        const [userResult] = await connection.query(`
            INSERT INTO user (userid, name, role, mobile, email, password, aadhaar, pancard) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [uniqueID, basicInfoFields.name, basicInfoFields.role, basicInfoFields.phone_number, basicInfoFields.email, hashedPassword, basicInfoFields.aadhar_no, basicInfoFields.pan_no]);

    

        // Insert into user_address table
        await connection.query(`
            INSERT INTO user_address (userid, street_or_house_no, landmark, address_one, address_two, city, state, pin, country) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [uniqueID, addressFields.street_or_house_no, addressFields.landmark, addressFields.address_one, addressFields.address_two, addressFields.city, addressFields.state, addressFields.pin_code, addressFields.country]);

        await connection.query(`
            INSERT INTO payout_details (userid, account_name, account_number, ifsc_code, branch_name, upiid) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [uniqueID, payoutFields.account_name, payoutFields.account_number, payoutFields.ifsc_code, payoutFields.branch_name, payoutFields.upiid]);

        await connection.commit();

        return NextResponse.json({ message: "Data inserted successfully",cred:{uniqueID,password}});
    } catch (err: any) {
        await connection.rollback();
        return NextResponse.json({ error: err.message });
    } finally {
        connection.end();
    }
}
