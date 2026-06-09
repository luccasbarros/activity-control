"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";
import {
  FORM_FIELDS,
  LOG_EVENTS,
  LOG_FAILURE_REASONS,
  QUERY_PARAMS,
} from "@/lib/constants";
import { VALIDATION_MESSAGES } from "@/lib/copy";
import { logServerEvent } from "@/lib/logger";
import { verifyPassword } from "@/lib/password";
import { ROUTES } from "@/lib/routes";

function redirectWithLoginError(message: string): never {
  redirect(`${ROUTES.login}?${QUERY_PARAMS.error}=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get(FORM_FIELDS.email) ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get(FORM_FIELDS.password) ?? "");

  if (!email || !password) {
    logServerEvent({
      event: LOG_EVENTS.authLoginFailed,
      metadata: { reason: LOG_FAILURE_REASONS.missingCredentials },
    });
    redirectWithLoginError(VALIDATION_MESSAGES.loginMissingCredentials);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (
    !user ||
    !verifyPassword(password, {
      passwordHash: user.passwordHash,
      passwordSalt: user.passwordSalt,
    })
  ) {
    logServerEvent({
      actorEmail: email,
      event: LOG_EVENTS.authLoginFailed,
      metadata: { reason: LOG_FAILURE_REASONS.invalidCredentials },
    });
    redirectWithLoginError(VALIDATION_MESSAGES.loginInvalidCredentials);
  }

  await setSessionCookie({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  logServerEvent({
    actorEmail: user.email,
    actorId: user.id,
    event: LOG_EVENTS.authLoginSucceeded,
  });
  redirect(ROUTES.dashboard);
}

export async function logoutAction() {
  await clearSessionCookie();
  logServerEvent({ event: LOG_EVENTS.authLogout });
  redirect(ROUTES.login);
}
