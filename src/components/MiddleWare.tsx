"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import NextTopLoader from "nextjs-toploader";
import Login from "@/components/Login";
import { useSession, SessionProvider } from "next-auth/react";
import Loading from "@/app/loading";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

const MiddleWare: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  if (status !== "authenticated") {
    return (
      <div>
        <Login />
      </div>
    );
  }

  return (
    <div>
      <NextTopLoader color="white" />
      <Navbar
        role={(session?.user as { role: string })?.role}
        userid={(session?.user as { userid: string })?.userid}
      />
      <MobileNav
        role={(session?.user as { role: string })?.role}
      />
      <div className="min-h-screen px-2 sm:px-4 md:px-[8vw] pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
};

const LoginManager: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SessionProvider>
    <MiddleWare>{children}</MiddleWare>
  </SessionProvider>
);

export default LoginManager;
