import type { NextApiRequest, NextApiResponse } from "next";
import allowData from "../../lib/allowlist.json";
import { sha256Hex, makeSession } from "../../lib/crypto";

const ALLOW = (allowData as string[]).map(s => s.trim().toLowerCase());

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const email = (req.body?.email ?? "").toString().trim().toLowerCase();
  if (!email) return res.status(400).json({ ok: false, error: "email_required" });

  const hash = sha256Hex(email);

  // ✅ Autorise si la liste contient le hash OU l'email brut normalisé
  const found = ALLOW.some(v => v === hash || v === email);
  if (!found) return res.status(401).json({ ok: false, error: "not_allowed" });

  const secret = process.env.AUTH_SECRET;
  if (!secret) return res.status(500).json({ ok: false, error: "missing_secret" });

  const cookieVal = makeSession(email, secret);
  res.setHeader(
    "Set-Cookie",
    `dfx=${cookieVal}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
  );

  return res.status(200).json({ ok: true, redirect: "/" });
}
