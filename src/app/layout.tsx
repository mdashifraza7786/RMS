import type { Metadata } from "next";
import "./globals.css";
import AdminNavbar from "@/components/AdminNavbar";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <NextTopLoader color="#FFFFFF" />
      <AdminNavbar/>
        {children}
      </body>
    </html>
  );
}