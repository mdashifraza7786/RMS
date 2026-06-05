import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByUserid } from "@/database";
import { compare } from "bcryptjs";
import type { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        userid: { label: "UserID" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const userid = credentials.userid as string | undefined;
        const password = credentials.password as string | undefined;

        if (!userid || !password) {
          throw new Error("Please provide userid and password.");
        }

        const user = await getUserByUserid(userid);

        if (!user) {
          throw new Error("User Not Found");
        }

        if (!user.password) {
          throw new Error("Incorrect Password");
        }

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Incorrect Password");
        }

        return {
          id: user.userid,
          userid: user.userid,
          name: user.name,
          role: user.role,
          email: user.email ?? null,
          mobile: user.mobile ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      const tokenWithUser = token as JWT & { user?: typeof session.user };
      if (tokenWithUser?.user) {
        session.user = tokenWithUser.user;
      }
      return session;
    },
  },
});