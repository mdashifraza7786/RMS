import mysql, { RowDataPacket } from 'mysql2/promise';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

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

export async function getMenu() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'menu' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT item_id,item_description,item_name,item_foodtype,item_price,item_thumbnail,item_type FROM menu'
        );

        if (userRows.length > 0) {
            return {
                users: userRows,
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

export async function updateMember(data: any) {
    const connection = await dbConnect();
    const { userid, name, role, mobile, email, photo, aadhaar, pancard, 
            account_name, account_number, ifsc_code, branch_name, upiid, 
            street_or_house_no, landmark, address_one, address_two, city, state, pin } = data;

    try {
        // Start transaction
        await connection.beginTransaction();

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

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success:true, message: 'Member updated successfully' });

    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error('Error updating member:', error);
        return NextResponse.json({ success:false, message: 'Error updating member' });

    } finally {
        await connection.end();
    }
}

export async function updateMenu(data: any) {
    const connection = await dbConnect();
    const { item_id, item_description, item_name, item_foodtype, item_price, item_thumbnail,item_type } = data;

    try {
        // Start transaction
        await connection.beginTransaction();

        // Update menu information
        await connection.query(
            `UPDATE menu SET item_description = ?, item_name = ?, item_foodtype = ?, item_price = ?, item_thumbnail = ?,item_type = ?
             WHERE item_id = ?`,
            [item_id,item_description, item_name, item_foodtype,item_type, item_price, item_thumbnail, item_type]
        );

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success: true, message: 'Menu updated successfully' });

    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error('Error updating menu:', error.message);
        return NextResponse.json({ success: false, message: 'Error updating menu' });

    } finally {
        await connection.end();
    }
}

