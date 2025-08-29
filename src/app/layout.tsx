import type { Metadata, Viewport } from "next";
import "./globals.css";
import LoginManager from "@/components/MiddleWare";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LoginManager>{children}</LoginManager>
        </ThemeProvider>
      </body>
    </html>
  );
}
