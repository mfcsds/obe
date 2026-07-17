import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APPWRITE_SESSION_COOKIE } from "@/lib/appwrite/config";

/**
 * Middleware ini HANYA melakukan pengecekan cepat "apakah cookie session
 * ada" untuk redirect awal (UX), bukan validasi keamanan yang sesungguhnya.
 *
 * Alasan teknis: `node-appwrite` memakai Node.js API yang tidak didukung
 * di Edge Runtime tempat middleware Next.js berjalan. Validasi user asli
 * (apakah sesi masih valid di server Appwrite) dan penegakan role
 * (lib/access-control.ts) dilakukan di `app/(root)/layout.tsx` sebagai
 * Server Component, yang berjalan di Node.js runtime penuh.
 *
 * Middleware ini tidak boleh dijadikan satu-satunya lapisan proteksi -
 * layout server tetap wajib melakukan `getLoggedInUser()` + role check
 * sebelum merender konten (OWASP A01: Broken Access Control).
 */
export function middleware(req: NextRequest) {
  const hasSessionCookie = Boolean(req.cookies.get(APPWRITE_SESSION_COOKIE));
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up");

  if (!hasSessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (hasSessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Meneruskan pathname lewat request header, karena Server Component
  // tidak punya akses langsung ke pathname saat ini. Dibaca kembali di
  // `app/(root)/layout.tsx` via `headers()` untuk penegakan role per-route
  // yang sesungguhnya (lib/access-control.ts).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
