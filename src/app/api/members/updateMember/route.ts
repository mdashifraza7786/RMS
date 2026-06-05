import { NextRequest, NextResponse } from "next/server";
import { updateMember, updatePassword } from "@/database";
import { auth } from "@/auth";
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    if (!session || userRole !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        const data = await request.json();

        if (data.type === 'passwordChange') {
            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            await updatePassword(data.userid, hashedPassword);
        } else {
            await updateMember(data);
        }

        return NextResponse.json({ message: 'Member updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ message: 'Error updating member' }, { status: 500 });
    }
}
