import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up');

    if (!isLoggedIn && !isAuthPage) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    }

    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
