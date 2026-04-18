import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * ROLE-BASED ACCESS CONTROL (RBAC) CONFIGURATION
 * 100% API Coverage - Deny by Default
 */
const ROLE_PERMISSIONS: Record<string, string[]> = {
    "/api/members": ["admin"],
    "/api/expenses": ["admin"],
    "/api/inventory": ["admin"], // Sensitive financial stock data
    "/api/settings": ["admin"],
    "/api/dashboard": ["admin"],  // Protects all dashboard sub-routes
    "/api/payout": ["admin"],
    "/api/chart": ["admin"],
    "/api/attendance": ["admin", "waiter", "chef"],
    "/api/order": ["admin", "waiter", "chef"],
    "/api/orders": ["admin", "waiter", "chef"],
    "/api/kitchenOrder": ["admin", "chef", "waiter"],
    "/api/menu": ["admin", "waiter"],
    "/api/recentOrder": ["admin", "waiter"],
    "/api/tables": ["admin", "waiter"],
};

const PUBLIC_PATHS = [
    "/api/auth/",
    "/api/login",
    "/api/health", // Public for setup diagnostics
];

export default async function middleware(req: NextRequest) {
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

    const { pathname, searchParams } = new URL(req.url);

    // 1. Check Public APIs Whitelist
    const isPublic = PUBLIC_PATHS.some(path => pathname.startsWith(path)) ||
        (pathname === "/api/settings" && searchParams.get("type") === "theme");

    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (isPublic) return response;

    // 2. Authentication Check (Must have valid JWT)
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET || "something",
        secureCookie: process.env.NODE_ENV === "production"
    });

    if (!token) {
        return new NextResponse(JSON.stringify({ success: false, message: "Unauthorized: No session found" }), {
            status: 401,
            headers: response.headers,
        });
    }

    const userRole = (token.user as any)?.role?.toLowerCase();

    // 3. Centralized RBAC Enforcement (Strict Route Matching)
    const matchedPath = Object.keys(ROLE_PERMISSIONS).find(restrictedPath => {
        return pathname === restrictedPath || pathname.startsWith(restrictedPath + "/");
    });
    
    // DENY BY DEFAULT: If path is not in permission map, it's forbidden
    if (!matchedPath) {
        return new NextResponse(JSON.stringify({ 
            success: false, 
            message: `Security Alert: Path ${pathname} is not explicitly mapped for access control.` 
        }), {
            status: 403,
            headers: response.headers,
        });
    }

    // Role Validation
    const allowedRoles = ROLE_PERMISSIONS[matchedPath];
    if (!userRole || !allowedRoles.includes(userRole)) {
        return new NextResponse(JSON.stringify({ 
            success: false, 
            message: `Forbidden: ${userRole} role does not have access to this resource` 
        }), {
            status: 403,
            headers: response.headers,
        });
    }

    return response;
}

export const config = {
    matcher: ["/api/:path*"],
};