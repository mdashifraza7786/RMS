import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "./api-response";

export type ApiHandler = (request: NextRequest, ...args: any[]) => Promise<Response>;

/**
 * Higher-order function to wrap API handlers with error handling and standardized responses.
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
    return async (request: NextRequest, ...args: any[]) => {
        try {
            const response = await handler(request, ...args);
            return response;
        } catch (error: any) {
            console.error("[API ERROR]:", {
                path: request.url,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });

            // Standardize error message
            let message = "An unexpected error occurred";
            let status = 500;

            if (error.name === 'ValidationError') {
                message = error.message;
                status = 400;
            } else if (error.code === 'ER_DUP_ENTRY') {
                message = "This record already exists";
                status = 409;
            }

            return NextResponse.json(errorResponse(message), { status });
        }
    };
}
