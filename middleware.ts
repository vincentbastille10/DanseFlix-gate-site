import { NextResponse } from "next/server";
import allowlist from "./lib/allowlist.json";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const email = req.cookies.get("dfx")?.value;
  if (!email) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const found = allowlist.some(
    (addr) => addr.trim().toLowerCase() === email.trim().toLowerCase()
  );

  if (!found) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|login|api).*)"],
};
