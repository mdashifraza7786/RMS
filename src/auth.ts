import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { dbConnect, getUserByUserid } from "@/database/database";
 
export const {handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        userid: { label: "UserID" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const userid = credentials.userid as string | undefined;
        const password = credentials.password as string | undefined;
        
        if(!userid || !password){
          throw new Error("Please provide email and password.");
        }
        const user = await getUserByUserid(userid);
        
        if(!user){
          throw new Error("User Not Found");
        }
        return { userid: user.userid, name:user.name,role:user.role,avatar:user.photo };

      }
    }),
  ],
})