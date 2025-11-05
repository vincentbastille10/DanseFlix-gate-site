import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import allow from "./lib/allowlist.json";

async function hmacSha256Base64Url(secret: string, data: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));

  const bytes = new Uint8Array(sig);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bytesToHex(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

async function sha256HexWeb(input: string) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return bytesToHex(buf);
}

async function verifySessionEdge(cookieValue: string | undefined, secret: string) {
  if (!cookieValue) return null;
  const [payload, sig] = cookieValue.split(".");
  if (!payload || !sig) return null;
  const expected = await hmacSha256Base64Url(secret, payload);
  if (sig !== expected) return null;
  // NOTE: Buffer est généralement dispo dans le middleware Next 14.
  // Si besoin, on pourra basculer vers un decodeur base64url web.
  const email = Buffer.from(payload, "base64url").toString("utf8");
  return email;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // chemins publics autorisés
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||          // ✅ exclut TOUTES les routes API
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET || "";
  const cookie = req.cookies.get("dfx")?.value;
  const email = await verifySessionEdge(cookie, secret);

  if (!email) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const hash = await sha256HexWeb(email.trim().toLowerCase());
  const ok = (allow as string[]).includes(hash);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // ✅ protège la racine
    // ✅ protège tout sauf API, assets Next, et pages publiques listées ci-dessus
    "/((?!api/|api$|_next/|favicon.ico|robots.txt|sitemap.xml|login).*)",
  ],
};
