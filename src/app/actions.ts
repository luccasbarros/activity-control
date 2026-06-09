"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseActivityFormData } from "@/lib/validation";

function firstValidationError(
  errors: Partial<Record<string, string[]>>,
  fallback: string,
) {
  return Object.values(errors).flat().find(Boolean) ?? fallback;
}

function redirectWithError(message: string): never {
  redirect(`/?error=${encodeURIComponent(message)}`);
}

export async function createActivityAction(formData: FormData) {
  const parsed = parseActivityFormData(formData);

  if (!parsed.success) {
    redirectWithError(firstValidationError(parsed.errors, "Invalid activity."));
  }

  await prisma.activity.create({
    data: parsed.data,
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateActivityAction(id: string, formData: FormData) {
  const parsed = parseActivityFormData(formData);

  if (!parsed.success) {
    redirectWithError(firstValidationError(parsed.errors, "Invalid activity."));
  }

  try {
    await prisma.activity.update({
      where: { id },
      data: parsed.data,
    });
  } catch {
    redirectWithError("Activity not found.");
  }

  revalidatePath("/");
  redirect("/");
}

export async function deleteActivityAction(id: string) {
  try {
    await prisma.activity.delete({
      where: { id },
    });
  } catch {
    redirectWithError("Activity not found.");
  }

  revalidatePath("/");
  redirect("/");
}
