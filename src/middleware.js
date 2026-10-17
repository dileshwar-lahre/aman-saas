import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Check karo kya user restaurant ke protected pages (/restaurant/...) par ja raha hai
  if (pathname.includes("/restaurant/")) {
    // Session token ya auth cookie check karo (jo tumhare login ke waqt set hoti hai, jaise 'token' ya 'auth_token')
    const token = req.cookies.get("token") || req.cookies.get("auth_token");

    if (!token) {
      // Agar token nahi hai, toh login page par bhej do aur current URL ko redirect parameter me rakh lo
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Middleware kahan-kahan chale uska matcher
export const config = {
  matcher: ["/restaurant/:path*"],
};