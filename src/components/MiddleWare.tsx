"use client"; // Ensure this component is a client component

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
         <NextTopLoader color="#FFFFFF" />
         <AdminNavbar />
         {children}
       </>
      ) : status === 'loading' ?(
        <Loading/>
      ):(
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
