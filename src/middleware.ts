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

  const session = await auth(req);

  const response = NextResponse.next();

  // Set CORS Headers
  response.headers.set("Access-Control-Allow-Origin", "*"); // Change to your frontend domain in production
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
