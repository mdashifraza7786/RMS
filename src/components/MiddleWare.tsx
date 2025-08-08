"use client";

import React, { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import Login from "@/components/Login";
import { useSession, SessionProvider } from "next-auth/react";
import Loading from "@/app/loading";
import Navbar from "@/components/Navbar";

const MiddleWare: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <div>
      {status === "authenticated" ? (
        <>
          <NextTopLoader color="white" />
          <Navbar
            role={(session?.user as { role: string })?.role}
            userid={(session?.user as { userid: string })?.userid}
          />
          <div className="min-h-screen px-[8vw]">
            {children}
          </div>
        </>
      ) : status === 'loading' ? (
        <Loading />
      ) : (
        <Login />
      )}
    </div>
  );
};

const LoginManager: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SessionProvider>
    <MiddleWare>{children}</MiddleWare>
  </SessionProvider>
);

export default LoginManager;
