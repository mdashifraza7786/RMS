import { NextRequest, NextResponse } from "next/server";
import {updateMember, updatePassword} from "@/database/database";
import bcrypt from 'bcrypt'

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if(data.type === 'passwordChange'){
            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            await updatePassword({...data, newPassword: hashedPassword});
        }else{
            await updateMember(data);
        }

        return NextResponse.json({ message: 'Member updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ message: 'Error updating member' }, { status: 500 });
    }
}
