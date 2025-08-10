import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Import NextAuth middleware

export default async function middleware(req:any) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const url = new URL(req.url);
  const pathname = url.pathname;

  // Allow unauthenticated access to auth/login and customer APIs
  const isPublicApi =
    pathname.startsWith("/api/auth/") ||
    pathname === "/api/login" ||
    pathname.startsWith("/api/customer/");

  const response = NextResponse.next();

  // Set CORS Headers
  response.headers.set("Access-Control-Allow-Origin", "*"); // Change to your frontend domain in production
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (isPublicApi) {
    return response;
  }

  const session = await auth(req);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};