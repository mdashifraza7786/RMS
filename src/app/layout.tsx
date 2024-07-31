import type { Metadata } from "next";
import "./globals.css";
import LoginManager from "@/components/MiddleWare";

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
        <LoginManager>{children}</LoginManager>
      </body>
    </html>
  );
}
