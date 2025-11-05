import type { NextApiRequest, NextApiResponse } from "next";
import allowlist from "../../../lib/allowlist.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body || {};
  if (!email || typeof email !== "string")
    return res.status(400).json({ ok: false, error: "email_required" });

  const norm = email.trim().toLowerCase();
  const ok = (allowlist as string[]).some(
    (addr) => addr.trim().toLowerCase() === norm
  );

  if (!ok) return res.status(401).json({ ok: false, error: "not_allowed" });

  // Stocke directement l'email comme cookie
  res.setHeader(
    "Set-Cookie",
    `dfx=${encodeURIComponent(norm)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
  );

  return res.status(200).json({ ok: true });
}
