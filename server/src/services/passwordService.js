import crypto from "crypto";

const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS).toString("hex");
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash) return false;

  const [scheme, salt, key] = storedHash.split(":");
  if (scheme !== "scrypt" || !salt || !key) return false;

  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  const storedKey = Buffer.from(key, "hex");

  if (storedKey.length !== derivedKey.length) return false;
  return crypto.timingSafeEqual(storedKey, derivedKey);
}
