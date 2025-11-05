
import type { NextApiRequest, NextApiResponse } from "next";
import allow from "../../../lib/allowlist.json";
import { sha256Hex, makeSession } from "../../../lib/crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body || {};
  if (!email || typeof email !== "string") return res.status(400).json({ ok:false, error:"email_required" });

  const norm = email.trim().toLowerCase();
  const hash = sha256Hex(norm);
  const found = (allow as string[]).includes(hash);
  if (!found) return res.status(401).json({ ok:false, error:"not_allowed" });

  const secret = process.env.AUTH_SECRET;
  if (!secret) return res.status(500).json({ ok:false, error:"missing_secret" });

  const cookieVal = makeSession(norm, secret);

  res.setHeader("Set-Cookie", `dfx=${cookieVal}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
  return res.status(200).json({ ok:true });
}
