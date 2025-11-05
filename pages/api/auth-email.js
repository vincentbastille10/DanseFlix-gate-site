import allowlist from "../../../lib/allowlist.json";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ ok: false, error: "email_required" });

  const found = allowlist.some(
    (addr) => addr.trim().toLowerCase() === email.trim().toLowerCase()
  );

  if (!found) {
    return res.status(401).json({ ok: false, error: "not_allowed" });
  }

  // ✅ Si trouvé : cookie valide 30 jours
  res.setHeader(
    "Set-Cookie",
    `dfx=${email.trim().toLowerCase()}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
  );

  return res.status(200).json({ ok: true });
}
