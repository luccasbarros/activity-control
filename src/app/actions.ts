"use server";

import { ActivityChangeType, type Activity } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { summarizeActivityUpdate } from "@/lib/activity-change";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeReturnTo, withQueryMessage } from "@/lib/navigation";
import { type ActivityFormInput, parseActivityFormData } from "@/lib/validation";

function firstValidationError(
  errors: Partial<Record<string, string[]>>,
  fallback: string,
) {
  return Object.values(errors).flat().find(Boolean) ?? fallback;
}

function redirectWithError(returnTo: string, message: string): never {
  redirect(withQueryMessage(returnTo, { key: "error", value: message }));
}

function redirectWithNotice(returnTo: string, notice: string): never {
  redirect(withQueryMessage(returnTo, { key: "notice", value: notice }));
}

function toActivityFormInput(activity: Activity): ActivityFormInput {
  return {
    title: activity.title,
    description: activity.description,
    priority: activity.priority,
    category: activity.category,
    team: activity.team,
    assignee: activity.assignee,
    status: activity.status,
  };
}

export async function createActivityAction(formData: FormData) {
  const user = await requireCurrentUser();
  const returnTo = sanitizeReturnTo(formData.get("returnTo"));
  const parsed = parseActivityFormData(formData);

  if (!parsed.success) {
    redirectWithError(
      returnTo,
      firstValidationError(parsed.errors, "Invalid activity."),
    );
  }

  await prisma.$transaction(async (tx) => {
    const activity = await tx.activity.create({
      data: parsed.data,
    });

    await tx.activityChange.create({
      data: {
        activityId: activity.id,
        activityTitle: activity.title,
        type: ActivityChangeType.CREATED,
        summary: "Created activity.",
        actorId: user.id,
        actorName: user.name,
      },
    });
  });

  revalidatePath("/");
  redirectWithNotice(returnTo, "activity-created");
}

export async function updateActivityAction(id: string, formData: FormData) {
  const user = await requireCurrentUser();
  const returnTo = sanitizeReturnTo(formData.get("returnTo"));
  const parsed = parseActivityFormData(formData);

  if (!parsed.success) {
    redirectWithError(
      returnTo,
      firstValidationError(parsed.errors, "Invalid activity."),
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      const before = await tx.activity.findUnique({
        where: { id },
      });

      if (!before) {
        throw new Error("Activity not found.");
      }

      const activity = await tx.activity.update({
        where: { id },
        data: parsed.data,
      });

      await tx.activityChange.create({
        data: {
          activityId: activity.id,
          activityTitle: activity.title,
          type: ActivityChangeType.UPDATED,
          summary: summarizeActivityUpdate(toActivityFormInput(before), parsed.data),
          actorId: user.id,
          actorName: user.name,
        },
      });
    });
  } catch {
    redirectWithError(returnTo, "Activity not found.");
  }

  revalidatePath("/");
  redirectWithNotice(returnTo, "activity-updated");
}

export async function deleteActivityAction(id: string, formData: FormData) {
  const user = await requireCurrentUser();
  const returnTo = sanitizeReturnTo(formData.get("returnTo"));

  try {
    await prisma.$transaction(async (tx) => {
      const activity = await tx.activity.findUnique({
        where: { id },
      });

      if (!activity) {
        throw new Error("Activity not found.");
      }

      await tx.activity.delete({
        where: { id },
      });

      await tx.activityChange.create({
        data: {
          activityId: null,
          activityTitle: activity.title,
          type: ActivityChangeType.DELETED,
          summary: "Deleted activity.",
          actorId: user.id,
          actorName: user.name,
        },
      });
    });
  } catch {
    redirectWithError(returnTo, "Activity not found.");
  }

  revalidatePath("/");
  redirectWithNotice(returnTo, "activity-deleted");
}
