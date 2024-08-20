import mysql, { RowDataPacket } from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'rms',
};

export async function dbConnect() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Error connecting to the MySQL database:', error);
        throw error;
    }
}

export async function getUserByUserid(userID: string) {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT userid,name,password,role,mobile,email,photo,aadhaar,pancard FROM user WHERE userid = ?', [userID]);

        if (rows.length > 0) {
            return  rows[0]; 
        }else{
            return false;
        }

        
    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getMembers() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'user' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT userid, name, role, mobile, email, photo, aadhaar, pancard FROM user'
        );

        // Fetch data from the 'payout_details' table
        const [payoutRows] = await connection.query<RowDataPacket[]>(
            'SELECT account_name, account_number, ifsc_code, branch_name, upiid FROM payout_details'
        );

        //fetch data from the 'user_address' table
        const [addressRows] = await connection.query<RowDataPacket[]>(
            'SELECT street_or_house_no,landmark,address_one,address_two,city,state,pin FROM user_address'
        );

        if (userRows.length > 0 || payoutRows.length > 0 || addressRows.length > 0) {
            return {
                users: userRows,
                payouts: payoutRows,
                addresses: addressRows
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getAccount(userid:string) {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT account_name,account_number,ifsc_code,branch_name,upiid FROM payout_details WHERE userid = ?',[userid]);

        if (rows.length > 0) {
            return  rows;
        }else{
            return false;
        }

        
    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export default async function updateMember(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const connection = await dbConnect();
    const { userid, name, role, mobile, email, photo, aadhaar, pancard, 
            account_name, account_number, ifsc_code, branch_name, upiid, 
            street_or_house_no, landmark, address_one, address_two, city, state, pin } = req.body;

    try {
        // Update user information
        await connection.query(
            `UPDATE user SET name = ?, role = ?, mobile = ?, email = ?, photo = ?, aadhaar = ?, pancard = ?
             WHERE userid = ?`,
            [name, role, mobile, email, photo, aadhaar, pancard, userid]
        );

        // Update payout details
        await connection.query(
            `UPDATE payout_details SET account_name = ?, account_number = ?, ifsc_code = ?, branch_name = ?, upiid = ?
             WHERE userid = ?`,
            [account_name, account_number, ifsc_code, branch_name, upiid, userid]
        );

        // Update address details
        await connection.query(
            `UPDATE user_address SET street_or_house_no = ?, landmark = ?, address_one = ?, address_two = ?, city = ?, state = ?, pin = ?
             WHERE userid = ?`,
            [street_or_house_no, landmark, address_one, address_two, city, state, pin, userid]
        );

        return res.status(200).json({ message: 'Member updated successfully' });

    } catch (error: any) {
        console.error('Error updating member:', error);
        return res.status(500).json({ message: 'Error updating member' });
    } finally {
        await connection.end();
    }
}