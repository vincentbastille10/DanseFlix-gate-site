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

  // ⬇️ Remplace le spread par une boucle pour compat TS/target
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
  // ⬇️ Remplace la conversion avec spread par une boucle
  return bytesToHex(buf);
}

async function verifySessionEdge(cookieValue: string | undefined, secret: string) {
  if (!cookieValue) return null;
  const [payload, sig] = cookieValue.split(".");
  if (!payload || !sig) return null;
  const expected = await hmacSha256Base64Url(secret, payload);
  if (sig !== expected) return null;
  const email = Buffer.from(payload, "base64url").toString("utf8");
  return email;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth-email") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
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
  matcher: ["/((?!_next|api/auth-email|favicon|public).*)"],
};
