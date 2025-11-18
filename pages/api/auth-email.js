// pages/api/auth-email.js
import allowlist from "../../lib/allowlist.json";

export default function handler(req, res) {
  const email =
    (req.method === "POST" ? req.body?.email : req.query?.email) || "";
  const clean = String(email).trim().toLowerCase();

  let list = [];

  if (Array.isArray(allowlist)) {
    list = allowlist;
  } else if (Array.isArray(allowlist.emails)) {
    list = allowlist.emails;
  }

  const found = list.some(
    (entry) => String(entry).trim().toLowerCase() === clean
  );

  res.status(200).json({ ok: found });
}
