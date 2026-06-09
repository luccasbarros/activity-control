import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import {
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
} from "./session";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
};

const cookieMaxAge = 60 * 60 * 8;

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
  });

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    maxAge: cookieMaxAge,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}
