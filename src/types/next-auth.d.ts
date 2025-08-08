import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      userid?: string;
      role?: string;
      mobile?: string;
    };
  }

  interface User {
    userid?: string;
    role?: string;
    mobile?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      userid?: string;
      role?: string;
      mobile?: string;
    };
  }
}


