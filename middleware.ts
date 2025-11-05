import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import allow from "./lib/allowlist.json";

// --- HMAC utilitaire ---
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

// --- SHA utilitaire ---
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

// --- Vérifie la session stockée dans le cookie ---
async function verifySessionEdge(cookieValue: string | undefined, secret: string) {
  if (!cookieValue) return null;
  const [payload, sig] = cookieValue.split(".");
  if (!payload || !sig) return null;
  const expected = await hmacSha256Base64Url(secret, payload);
  if (sig !== expected) return null;
  try {
    return Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

// --- Middleware principal ---
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Chemins publics non protégés
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||          // exclut toutes les routes API
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".mp3") ||
    pathname.endsWith(".mp4") ||
    pathname.endsWith(".json")
  ) {
    return NextResponse.next();
  }

  // --- Vérifie la session ---
  const secret = process.env.AUTH_SECRET || "";
  const cookie = req.cookies.get("dfx")?.value;
  const email = await verifySessionEdge(cookie, secret);
  if (!email) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --- Vérifie la présence dans l’allowlist ---
  const norm = email.trim().toLowerCase();
  const hash = await sha256HexWeb(norm);
  const ok = (allow as string[]).some(v => {
    const val = v.trim().toLowerCase();
    return val === norm || val === hash;
  });

  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Si tout est bon : accès autorisé
  return NextResponse.next();
}

// --- Configuration du middleware ---
export const config = {
  matcher: [
    "/", // protège la racine
    "/((?!api/|api$|_next/|favicon.ico|robots.txt|sitemap.xml|login).*)",
  ],
};
