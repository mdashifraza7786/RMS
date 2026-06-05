import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnect from './connection';
import { User, UserAddress, PayoutDetails, DbResponse } from '../types';

/** Shape of the combined account query result (user + payout + address). */
interface AccountRow extends RowDataPacket {
  userid: string;
  name: string;
  role: string;
  mobile: string;
  email?: string | null;
  photo?: string | null;
  aadhaar?: string | null;
  pancard?: string | null;
  // payout_details
  account_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  branch_name?: string | null;
  upiid?: string | null;
  // user_address
  street_or_house_no?: string | null;
  landmark?: string | null;
  address_one?: string | null;
  address_two?: string | null;
  city?: string | null;
  state?: string | null;
  pin?: string | null;
  country?: string | null;
}

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

export async function getMembers(page: number = 1, limit: number = 10, search: string = ''): Promise<DbResponse<{ members: AccountRow[]; total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        const [countRows] = await connection.query<RowDataPacket[]>(
            `SELECT COUNT(*) as total FROM user WHERE name LIKE ? OR email LIKE ? OR role LIKE ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`]
        );
        const total = countRows[0]?.total ?? 0;

        const [rows] = await connection.query<AccountRow[]>(
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
        return { success: true, data: { members: rows, total } };
    } catch (error) {
        console.error('Error fetching members:', error);
        return { success: false, message: 'Failed to fetch members' };
    } finally {
        await connection.release();
    }
}

export async function updateMember(data: Partial<AccountRow> & { userid: string }): Promise<DbResponse<void>> {
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

export async function getAccount(userid: string): Promise<DbResponse<AccountRow | null>> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.query<AccountRow[]>(
            `SELECT u.*, p.account_name, p.account_number, p.ifsc_code, p.branch_name, p.upiid,
                    a.street_or_house_no, a.landmark, a.address_one, a.address_two, a.city, a.state, a.pin, a.country
             FROM user u
             LEFT JOIN payout_details p ON u.userid = p.userid
             LEFT JOIN user_address a ON u.userid = a.userid
             WHERE u.userid = ?`,
            [userid]
        );
        return { success: true, data: rows.length > 0 ? rows[0] : null };
    } catch (error) {
        console.error('Error fetching account:', error);
        return { success: false, message: 'Failed' };
    } finally {
        await connection.release();
    }
}
