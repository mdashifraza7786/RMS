"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Login from "@/components/Login";
import { useSession, SessionProvider } from "next-auth/react";
import Loading from "@/app/loading";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

import { useTheme } from "@/contexts/ThemeContext";
import { themeRegistry } from "../../themes/theme-registry";

const MiddleWare: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const { theme, loading } = useTheme();

  if (status === "loading" || loading) {
    return <Loading />;
  }

  if (status !== "authenticated") {
    return (
      <div>
        <Login />
      </div>
    );
  }

  // Lookup the active theme in the registry
  const activeThemeName = theme.active_theme_folder || 'default';
  const ThemeConfig = themeRegistry[activeThemeName] || themeRegistry['default'];
  const ActiveLayout = ThemeConfig.Layout;

  return (
    <ActiveLayout 
      role={(session?.user as { role: string })?.role}
      userid={(session?.user as { userid: string })?.userid}
    >
      {children}
    </ActiveLayout>
  );
};

const LoginManager: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SessionProvider>
    <MiddleWare>{children}</MiddleWare>
  </SessionProvider>
);

export default LoginManager;
