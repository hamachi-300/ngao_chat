import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get('discord_access_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}
