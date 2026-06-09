import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export type PasswordHash = {
  passwordHash: string;
  passwordSalt: string;
};

export function hashPassword(password: string): PasswordHash {
  const passwordSalt = randomBytes(24).toString("base64url");
  const passwordHash = pbkdf2Sync(
    password,
    passwordSalt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST,
  ).toString("base64url");

  return { passwordHash, passwordSalt };
}

export function verifyPassword(password: string, stored: PasswordHash) {
  const attemptedHash = pbkdf2Sync(
    password,
    stored.passwordSalt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST,
  );
  const currentHash = Buffer.from(stored.passwordHash, "base64url");

  if (attemptedHash.length !== currentHash.length) {
    return false;
  }

  return timingSafeEqual(attemptedHash, currentHash);
}
