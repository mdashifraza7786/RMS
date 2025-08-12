"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import NextTopLoader from "nextjs-toploader";
import Login from "@/components/Login";
import { useSession, SessionProvider } from "next-auth/react";
import Loading from "@/app/loading";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import CustomerLogin from "@/components/CustomerLogin";

const MiddleWare: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [staffMode, setStaffMode] = useState<boolean | null>(null);

  // Detect URL query param and persist staff mode flag
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const me = url.searchParams.get("_me");
    if (me === "staff") {
      localStorage.setItem("appMode", "staff");
      setStaffMode(true);
      // Optional: remove the query param from URL without reload
      url.searchParams.delete("_me");
      window.history.replaceState({}, "", url.toString());
      return;
    }
    const mode = localStorage.getItem("appMode");
    setStaffMode(mode === "staff");
  }, []);

  const role = (session?.user as any)?.role as string | undefined;
  const isCustomer = role === "customer";

  if (status === "loading" || staffMode === null) {
    return <Loading />;
  }

  if (status !== "authenticated") {
    return (
      <div>
        {staffMode ? <Login /> : <CustomerLogin />}
      </div>
    );
  }

  return (
    <div>
      <NextTopLoader color="white" />
      {!isCustomer && (
        <>
          <Navbar
            role={(session?.user as { role: string })?.role}
            userid={(session?.user as { userid: string })?.userid}
          />
          <MobileNav
            role={(session?.user as { role: string })?.role}
          />
        </>
      )}
      <div className={isCustomer ? "min-h-screen" : "min-h-screen px-2 sm:px-4 md:px-[8vw] pt-16 lg:pt-0"}>
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
