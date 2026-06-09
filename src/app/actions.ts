"use server";

import { ActivityChangeType, type Activity } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { summarizeActivityUpdate } from "@/lib/activity-change";
import { requireCurrentUser } from "@/lib/auth";
import {
  ACTIVITY_CHANGE_SUMMARIES,
  FORM_FIELDS,
  LOG_EVENTS,
  NOTICE_CODES,
  QUERY_PARAMS,
} from "@/lib/constants";
import { VALIDATION_MESSAGES } from "@/lib/copy";
import { prisma } from "@/lib/db";
import { logServerEvent } from "@/lib/logger";
import { sanitizeReturnTo, withQueryMessage } from "@/lib/navigation";
import { ROUTES } from "@/lib/routes";
import { type ActivityFormInput, parseActivityFormData } from "@/lib/validation";

function firstValidationError(
  errors: Partial<Record<string, string[]>>,
  fallback: string,
) {
  return Object.values(errors).flat().find(Boolean) ?? fallback;
}

function redirectWithError(returnTo: string, message: string): never {
  redirect(withQueryMessage(returnTo, { key: QUERY_PARAMS.error, value: message }));
}

function redirectWithNotice(returnTo: string, notice: string): never {
  redirect(withQueryMessage(returnTo, { key: QUERY_PARAMS.notice, value: notice }));
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

function revalidateActivityViews() {
  revalidatePath(ROUTES.dashboard);
  revalidatePath(ROUTES.activities);
  revalidatePath(ROUTES.history);
}

export async function createActivityAction(formData: FormData) {
  const user = await requireCurrentUser();
  const returnTo = sanitizeReturnTo(formData.get(FORM_FIELDS.returnTo));
  const parsed = parseActivityFormData(formData);

  if (!parsed.success) {
    redirectWithError(
      returnTo,
      firstValidationError(parsed.errors, VALIDATION_MESSAGES.invalidActivity),
    );
  }

  const createdActivity = await prisma.$transaction(async (tx) => {
    const activity = await tx.activity.create({
      data: parsed.data,
    });

    await tx.activityChange.create({
      data: {
        activityId: activity.id,
        activityTitle: activity.title,
        type: ActivityChangeType.CREATED,
        summary: ACTIVITY_CHANGE_SUMMARIES.created,
        actorId: user.id,
        actorName: user.name,
      },
    });

    return activity;
  });

  logServerEvent({
    actorEmail: user.email,
    actorId: user.id,
    event: LOG_EVENTS.activityCreated,
    metadata: {
      activityId: createdActivity.id,
      priority: createdActivity.priority,
      status: createdActivity.status,
    },
  });
  revalidateActivityViews();
  redirectWithNotice(returnTo, NOTICE_CODES.activityCreated);
}

export async function updateActivityAction(id: string, formData: FormData) {
  const user = await requireCurrentUser();
  const returnTo = sanitizeReturnTo(formData.get(FORM_FIELDS.returnTo));
  const parsed = parseActivityFormData(formData);

  if (!parsed.success) {
    redirectWithError(
      returnTo,
      firstValidationError(parsed.errors, VALIDATION_MESSAGES.invalidActivity),
    );
  }

  try {
    const updatedActivity = await prisma.$transaction(async (tx) => {
      const before = await tx.activity.findUnique({
        where: { id },
      });

      if (!before) {
        throw new Error(VALIDATION_MESSAGES.activityNotFound);
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

      return activity;
    });

    logServerEvent({
      actorEmail: user.email,
      actorId: user.id,
      event: LOG_EVENTS.activityUpdated,
      metadata: {
        activityId: updatedActivity.id,
        priority: updatedActivity.priority,
        status: updatedActivity.status,
      },
    });
  } catch {
    logServerEvent({
      actorEmail: user.email,
      actorId: user.id,
      event: LOG_EVENTS.activityUpdateFailed,
      metadata: { activityId: id },
    });
    redirectWithError(returnTo, VALIDATION_MESSAGES.activityNotFound);
  }

  revalidateActivityViews();
  redirectWithNotice(returnTo, NOTICE_CODES.activityUpdated);
}

export async function deleteActivityAction(id: string, formData: FormData) {
  const user = await requireCurrentUser();
  const returnTo = sanitizeReturnTo(formData.get(FORM_FIELDS.returnTo));

  try {
    const deletedActivity = await prisma.$transaction(async (tx) => {
      const activity = await tx.activity.findUnique({
        where: { id },
      });

      if (!activity) {
        throw new Error(VALIDATION_MESSAGES.activityNotFound);
      }

      await tx.activity.delete({
        where: { id },
      });

      await tx.activityChange.create({
        data: {
          activityId: null,
          activityTitle: activity.title,
          type: ActivityChangeType.DELETED,
          summary: ACTIVITY_CHANGE_SUMMARIES.deleted,
          actorId: user.id,
          actorName: user.name,
        },
      });

      return activity;
    });

    logServerEvent({
      actorEmail: user.email,
      actorId: user.id,
      event: LOG_EVENTS.activityDeleted,
      metadata: {
        activityId: deletedActivity.id,
        priority: deletedActivity.priority,
        status: deletedActivity.status,
      },
    });
  } catch {
    logServerEvent({
      actorEmail: user.email,
      actorId: user.id,
      event: LOG_EVENTS.activityDeleteFailed,
      metadata: { activityId: id },
    });
    redirectWithError(returnTo, VALIDATION_MESSAGES.activityNotFound);
  }

  revalidateActivityViews();
  redirectWithNotice(returnTo, NOTICE_CODES.activityDeleted);
}
