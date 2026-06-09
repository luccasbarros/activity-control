import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_MAX_AGE_SECONDS } from "./constants";

export const SESSION_COOKIE_NAME = "activity_control_session";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  expiresAt: number;
};

const demoSessionSecret = "local-activity-control-demo-secret";

export function getSessionSecret() {
  if (process.env.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set in production.");
  }

  return demoSessionSecret;
}

export function getSessionExpiresAt(now = Date.now()) {
  return now + SESSION_MAX_AGE_SECONDS * 1000;
}

function signatureFor(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function signSessionToken(
  payload: SessionPayload,
  secret = getSessionSecret(),
) {
  const encodedPayload = encodeURIComponent(JSON.stringify(payload));
  const signature = signatureFor(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret = getSessionSecret(),
): SessionPayload | null {
  if (!token) {
    return null;
  }

  const separatorIndex = token.lastIndexOf(".");

  if (separatorIndex === -1) {
    return null;
  }

  const encodedPayload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signatureFor(encodedPayload, secret);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(encodedPayload));

    if (
      typeof parsed.userId !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.expiresAt !== "number" ||
      !Number.isFinite(parsed.expiresAt)
    ) {
      return null;
    }

    if (Date.now() > parsed.expiresAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
