import { dbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";  

export async function POST(request:Request) {
    const { byDate, ...rest } = await request.json();
    let userid, role;
    if ('userid' in rest && 'role' in rest) {
        userid = rest.userid;
        role = rest.role;
    }
    const connection = await dbConnect();

    try {
        let records: any;
        if(role === 'waiter' || role === 'chef'){
            [records] = await connection.query<RowDataPacket[]>(
                'SELECT userid,name,role,status,date,time FROM attendance WHERE date = ? AND userid = ?',
                [byDate, userid]
            );
        }else{
            records = await connection.query<RowDataPacket[]>(
                'SELECT userid,name,role,status,date,time FROM attendance WHERE date = ?',
                [byDate]
            );
        }

        if(records.length > 0){
            return NextResponse.json({ message: 'Attendance Generated Successfully', data: records });
        }else{
            return NextResponse.json({ message: 'No Attendance Found', data: [] });
        }
    } catch (error) {
        console.error('Error inserting attendance records:', error);
        return NextResponse.json({ message: 'Failed to insert attendance records'}, { status: 500 });
    } finally {
        connection.end();
    }
}
