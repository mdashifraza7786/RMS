import { NextRequest, NextResponse } from "next/server";
import updateMember from "@/database/database";

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        // You need to mock the `res` response here
        const mockRes = {
            status: (statusCode: number) => ({
                json: (responseBody: any) => NextResponse.json(responseBody, { status: statusCode }),
            }),
        };

        // Calling updateMember with req and res
        await updateMember({ body: data } as any, mockRes as any);

        return NextResponse.json({ message: 'Member updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ message: 'Error updating member' }, { status: 500 });
    }
}
