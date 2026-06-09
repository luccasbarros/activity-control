"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

function redirectWithLoginError(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirectWithLoginError("Email and password are required.");
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
    redirectWithLoginError("Invalid email or password.");
  }

  await setSessionCookie({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  redirect("/");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
