
import crypto from "crypto";

export function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// signature HMAC pour éviter le cookie falsifié
export function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function makeSession(email: string, secret: string) {
  const norm = email.trim().toLowerCase();
  const payload = Buffer.from(norm).toString("base64url");
  const sig = sign(payload, secret);
  return `${payload}.${sig}`;
}

export function verifySession(cookieValue: string | undefined, secret: string) {
  if (!cookieValue) return null;
  const [payload, sig] = cookieValue.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload, secret);
  if (sig !== expected) return null;
  const email = Buffer.from(payload, "base64url").toString("utf8");
  return email;
}
