import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { dbConnect, getUserByUserid, getCustomerByMobile } from "./database/database";
 
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

        // Special case: customer flow uses synthetic userid `cust:<mobile>` and a dummy password
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

        // Build a minimal session-safe user to avoid large JWT cookies
        const minimalUser = {
          userid: (user as any).userid,
          name: (user as any).name,
          role: (user as any).role,
          email: (user as any).email ?? null,
          mobile: (user as any).mobile ?? null,
          // EXCLUDE photo and any large fields from session to prevent ERR_RESPONSE_HEADERS_TOO_BIG
        };
        return minimalUser as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist our safe user fields onto the token
      if (user) {
        token.user = user as any; // already minimal from authorize
      }
      return token;
    },
    async session({ session, token }) {
      // Expose our safe user fields on session
      if (token && (token as any).user) {
        session.user = (token as any).user as any;
      }
      return session;
    },
  },
});