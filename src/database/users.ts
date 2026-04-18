import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnect from './connection';
import { User, UserAddress, PayoutDetails, DbResponse } from '../types';

export async function getUserByUserid(userID: string): Promise<User | null> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(
            'SELECT userid,name,password,role,mobile,email,photo,aadhaar,pancard FROM user WHERE userid = ?', 
            [userID]
        );
        return rows.length > 0 ? (rows[0] as User) : null;
    } finally {
        await connection.release();
    }
}

export async function getMembers(page: number = 1, limit: number = 10, search: string = ''): Promise<DbResponse<any[]>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT u.userid, u.name, u.role, u.mobile, u.email, u.photo, u.aadhaar, u.pancard,
                    p.account_name, p.account_number, p.ifsc_code, p.branch_name, p.upiid,
                    a.street_or_house_no, a.landmark, a.address_one, a.address_two, a.city, a.state, a.pin
             FROM user u
             LEFT JOIN payout_details p ON u.userid = p.userid
             LEFT JOIN user_address a ON u.userid = a.userid
             WHERE u.name LIKE ? OR u.email LIKE ? OR u.role LIKE ?
             LIMIT ? OFFSET ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset]
        );
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error fetching members:', error);
        return { success: false, message: 'Failed to fetch members' };
    } finally {
        await connection.release();
    }
}

export async function updateMember(data: any): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    const { userid, name, role, mobile, email, photo, aadhaar, pancard,
        account_name, account_number, ifsc_code, branch_name, upiid,
        street_or_house_no, landmark, address_one, address_two, city, state, pin } = data;

    try {
        await connection.beginTransaction();

        await connection.query(
            `UPDATE user SET name = ?, role = ?, mobile = ?, email = ?, photo = ?, aadhaar = ?, pancard = ? WHERE userid = ?`,
            [name, role, mobile, email, photo, aadhaar, pancard, userid]
        );

        await connection.query(
            `UPDATE payout_details SET account_name = ?, account_number = ?, ifsc_code = ?, branch_name = ?, upiid = ? WHERE userid = ?`,
            [account_name, account_number, ifsc_code, branch_name, upiid, userid]
        );

        await connection.query(
            `UPDATE user_address SET street_or_house_no = ?, landmark = ?, address_one = ?, address_two = ?, city = ?, state = ?, pin = ? WHERE userid = ?`,
            [street_or_house_no, landmark, address_one, address_two, city, state, pin, userid]
        );

        await connection.commit();
        return { success: true, message: 'Member updated successfully' };
    } catch (error) {
        await connection.rollback();
        console.error('Error updating member:', error);
        return { success: false, message: 'Error updating member' };
    } finally {
        await connection.release();
    }
}

export async function updatePassword(userid: string, newPasswordHash: string): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    try {
        await connection.query('UPDATE user SET password = ? WHERE userid = ?', [newPasswordHash, userid]);
        return { success: true, message: 'Password updated successfully' };
    } catch (error) {
        console.error('Error updating password:', error);
        return { success: false, message: 'Error updating password' };
    } finally {
        await connection.release();
    }
}

export async function getAccount(userid: string): Promise<DbResponse<any>> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT u.*, p.account_name, p.account_number, p.ifsc_code, p.branch_name, p.upiid,
                    a.street_or_house_no, a.landmark, a.address_one, a.address_two, a.city, a.state, a.pin, a.country
             FROM user u
             LEFT JOIN payout_details p ON u.userid = p.userid
             LEFT JOIN user_address a ON u.userid = a.userid
             WHERE u.userid = ?`,
            [userid]
        );
        return { success: true, data: rows[0] };
    } catch (error) {
        console.error('Error fetching account:', error);
        return { success: false, message: 'Failed' };
    } finally {
        await connection.release();
    }
}
