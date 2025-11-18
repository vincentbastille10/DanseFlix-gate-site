import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ ok: false, error: "Email manquant" });
    }

    const clean = email.trim().toLowerCase();

    const filePath = path.join(process.cwd(), "lib", "allowlist.json");
    const raw = fs.readFileSync(filePath, "utf8");

    let list = [];
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data.emails)) {
      list = data.emails;
    }

    const found = list.some(
      (entry) => String(entry).trim().toLowerCase() === clean
    );

    return res.status(200).json({ ok: found });
  } catch (e) {
    console.error("AUTH EMAIL ERROR", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
