import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import {
  SESSION_COOKIE_NAME,
  getSessionExpiresAt,
  signSessionToken,
  verifySessionToken,
} from "./session";
import { SESSION_MAX_AGE_SECONDS } from "./constants";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
};

function shouldUseSecureCookie() {
  if (process.env.AUTH_COOKIE_SECURE) {
    return process.env.AUTH_COOKIE_SECURE === "true";
  }

  return process.env.NODE_ENV === "production";
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = verifySessionToken(token);

  if (!payload) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function setSessionCookie(user: CurrentUser) {
  const cookieStore = await cookies();
  const token = signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    expiresAt: getSessionExpiresAt(),
  });

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    maxAge: 0,
    path: "/",
  });
}
