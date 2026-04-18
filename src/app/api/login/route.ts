import { z } from 'zod';
import { signIn } from '@/auth';
import { NextResponse } from 'next/server';
import { getUserByUserid } from '@/database';
import { compare } from 'bcryptjs';
import { loginSchema } from '@/lib/validation';
import { checkRateLimit } from '@/utils/rateLimit';
import { withErrorHandling } from '@/lib/api-handler';
import { successResponse } from '@/lib/api-response';

export const POST = withErrorHandling(async (request: Request) => {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimit = checkRateLimit(`login_${ip}`, 5, 60000); // 5 attempts per minute
  
  if (!rateLimit.success) {
    return NextResponse.json({ 
      success: false, 
      message: 'Too many login attempts. Please try again in a minute.' 
    }, { status: 429 });
  }

  const body = await request.json();
  const result = loginSchema.safeParse(body);
  
  if (!result.success) {
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid input', 
      errors: result.error.issues.map(e => e.message) 
    }, { status: 400 });
  }

  const { userid, password: incommingPassword } = result.data;
  const user = await getUserByUserid(userid);

  if (!user || !user.password) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }

  const passwordMatch = await compare(incommingPassword, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }

  try {
    await signIn('credentials', {
      userid,
      password: incommingPassword,
      redirect: false,
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, aadhaar, pancard, ...userWithoutSensitiveData } = user as any;
    
    return NextResponse.json(successResponse(userWithoutSensitiveData, 'Login successful'));

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 401 });
  }
});