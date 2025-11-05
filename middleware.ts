import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import allowData from "./lib/allowlist.json";

/** Allowlist normalisée (minuscule). Contient des SHA-256 hex. */
const ALLOW = (allowData as string[]).map(s => s.trim().toLowerCase());

/** HMAC SHA-256 -> base64url */
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
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** SHA-256 -> hex (minuscules) via WebCrypto */
function bytesToHex(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, "0");
  return hex;
}
async function sha256HexWeb(input: string) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return bytesToHex(buf);
}

/** base64url -> UTF-8 (sans Buffer) */
function b64urlToUtf8(b64url: string) {
  const padLen = (4 - (b64url.length % 4)) % 4;
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLen);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Vérifie le cookie de session */
async function verifySessionEdge(cookieValue: string | undefined, secret: string) {
  if (!cookieValue) return null;
  const [payload, sig] = cookieValue.split(".");
  if (!payload || !sig) return null;
  const expected = await hmacSha256Base64Url(secret, payload);
  if (sig !== expected) return null;
  try {
    return b64urlToUtf8(payload); // l’email en clair
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // chemins publics (non protégés)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||      // exclut TOUTES les API
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

  // contrôle allowlist (hash côté middleware)
  const norm = email.trim().toLowerCase();
  const hash = await sha256HexWeb(norm);
  const ok = ALLOW.includes(hash); // allowlist = hashes seulement
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // protège la racine
    "/((?!api/|api$|_next/|favicon.ico|robots.txt|sitemap.xml|login).*)",
  ],
};
