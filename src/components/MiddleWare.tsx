"use client";

import React, { Suspense } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import NextTopLoader from "nextjs-toploader";
import Login from "@/components/Login";
import { useSession, SessionProvider } from "next-auth/react";
import Loading from "@/app/loading";

const MiddleWare: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <div>
      {status === "authenticated" ? (
        <>
          <NextTopLoader color="white" />
          <AdminNavbar />
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
