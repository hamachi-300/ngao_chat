import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("userToken")?.value;

    // Redirect if no token is found
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();  // Allow the request to continue
}

// Apply middleware to specific routes
export const config = {
    matcher: ["/home/:path*"],  // Add your protected routes here
};
