import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserByUserid, updatePassword } from "@/database";
import bcrypt from "bcryptjs";
import { withErrorHandling } from "@/lib/api-handler";

export const POST = withErrorHandling(async (request: NextRequest) => {
    const session = await auth();
    if (!session || !session.user || !session.user.userid) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userid = session.user.userid as string;
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ success: false, message: "Current and new passwords are required" }, { status: 400 });
    }

    // Get user from DB
    const user = await getUserByUserid(userid);
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return NextResponse.json({ success: false, message: "Incorrect current password" }, { status: 401 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    const result = await updatePassword(userid, newPasswordHash);

    if (result.success) {
        return NextResponse.json({ success: true, message: "Password updated successfully" });
    } else {
        return NextResponse.json({ success: false, message: result.message }, { status: 500 });
    }
});
