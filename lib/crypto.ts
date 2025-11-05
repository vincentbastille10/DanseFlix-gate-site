// lib/crypto.ts
import crypto from "crypto";

/** SHA-256 -> hex (toujours minuscules) */
export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

/** Session cookie: payload.base64url + "." + HMAC(base64url) */
export function makeSession(email: string, secret: string): string {
  const payload = Buffer.from(email, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
