import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/endpoints')) {
        console.log('endpoints');
    } else if (request.nextUrl.pathname.startsWith('/api')) {
        console.log('api');
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/(.*)"],
}