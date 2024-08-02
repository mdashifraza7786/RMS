import { signIn } from '@/auth';
import { CredentialsSignin } from 'next-auth';
import { NextResponse } from 'next/server';
import { getUserByUserid } from '@/database/database';


export async function POST(request:Request) {
  try {
    const incommingCredentials = await request.json();
    const userid = incommingCredentials.userid as string | undefined;
    const password = incommingCredentials.password as string | undefined;

    if (!userid || !password) {
      return NextResponse.json({success:false, message: 'Please provide userid and password' });
    }


    const user = await getUserByUserid(userid as string);

    if (!user) {
      return NextResponse.json({success:false, message: 'User not found' });
    }
    if (!user.password) {
        return NextResponse.json({ success:false, message: 'Incorrect Password' });
      }
    // const passwordMatch = await compare(password, user.password);

    // if (!passwordMatch) {
    //   return NextResponse.json({ success:"false", message: 'Incorrect password' });
    // }

    try {
      await signIn('credentials', {
        userid,
        password,
        redirect: false,
      });
      return NextResponse.json({ success:true, message: 'Login successful', userdata:user });

    } catch (error) {
      const err = error as CredentialsSignin;
      return NextResponse.json({success:false, message:err});
    }

  } catch (error) {
    return NextResponse.json({ success:false, message: 'Internal Server Error' });
  }
}