import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByUserid, getCustomerByMobile } from "./database/database";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
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
          throw new Error("Please provide email and password.");
        }

        if (userid.startsWith("cust:")) {
          const mobile = userid.replace("cust:", "");
          const customer = await getCustomerByMobile(mobile);
          if (!customer) throw new Error("Customer not found");
          return {
            userid: `cust:${mobile}`,
            name: customer.name,
            role: "customer",
            mobile: customer.mobile,
            age: customer.age ?? null,
            gender: customer.gender ?? null,
          } as any;
        }

        const user = await getUserByUserid(userid);

        if (!user) {
          throw new Error("User Not Found");
        }

        const minimalUser = {
          userid: (user as any).userid,
          name: (user as any).name,
          role: (user as any).role,
          email: (user as any).email ?? null,
          mobile: (user as any).mobile ?? null,
        };
        return minimalUser as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && (token as any).user) {
        session.user = (token as any).user as any;
      }
      return session;
    },
  },
});