import mysql, { RowDataPacket } from 'mysql2/promise';
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
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT userid,name,role,mobile,email,photo,aadhaar,pancard FROM user WHERE userid = ?', [userID]);

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
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT userid,name,role,mobile,email,photo,aadhaar,pancard FROM user');

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