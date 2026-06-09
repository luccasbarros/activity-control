import { ActivityStatus, Category, Priority } from "@prisma/client";
import { z } from "zod";
import {
  ACTIVITY_FIELD_LIMITS,
  FORM_FIELDS,
} from "./constants";
import { FORM_LIMIT_MESSAGES, VALIDATION_MESSAGES } from "./copy";

const priorityValues = [
  Priority.LOW,
  Priority.MEDIUM,
  Priority.HIGH,
  Priority.CRITICAL,
] as const;

const categoryValues = [
  Category.BUG,
  Category.FEATURE,
  Category.IMPROVEMENT,
  Category.SUPPORT,
  Category.OPERATIONAL,
] as const;

const statusValues = [
  ActivityStatus.PENDING,
  ActivityStatus.IN_PROGRESS,
  ActivityStatus.DONE,
  ActivityStatus.BLOCKED,
] as const;

export const activityFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.requiredTitle)
    .min(ACTIVITY_FIELD_LIMITS.title.min, FORM_LIMIT_MESSAGES.titleMin)
    .max(ACTIVITY_FIELD_LIMITS.title.max, FORM_LIMIT_MESSAGES.titleMax),
  description: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.requiredDescription)
    .min(
      ACTIVITY_FIELD_LIMITS.description.min,
      FORM_LIMIT_MESSAGES.descriptionMin,
    )
    .max(
      ACTIVITY_FIELD_LIMITS.description.max,
      FORM_LIMIT_MESSAGES.descriptionMax,
    ),
  priority: z.enum(priorityValues, {
    errorMap: () => ({ message: VALIDATION_MESSAGES.invalidPriority }),
  }),
  category: z.enum(categoryValues, {
    errorMap: () => ({ message: VALIDATION_MESSAGES.invalidCategory }),
  }),
  team: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.requiredTeam)
    .min(ACTIVITY_FIELD_LIMITS.team.min, FORM_LIMIT_MESSAGES.teamMin)
    .max(ACTIVITY_FIELD_LIMITS.team.max, FORM_LIMIT_MESSAGES.teamMax),
  assignee: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.requiredAssignee)
    .min(ACTIVITY_FIELD_LIMITS.assignee.min, FORM_LIMIT_MESSAGES.assigneeMin)
    .max(ACTIVITY_FIELD_LIMITS.assignee.max, FORM_LIMIT_MESSAGES.assigneeMax),
  status: z.enum(statusValues, {
    errorMap: () => ({ message: VALIDATION_MESSAGES.invalidStatus }),
  }),
});

export type ActivityFormInput = z.infer<typeof activityFormSchema>;

export type ActivityFormState =
  | {
      success: true;
      data: ActivityFormInput;
      errors: Record<string, never>;
    }
  | {
      success: false;
      data: null;
      errors: Partial<Record<keyof ActivityFormInput, string[]>>;
    };

export function parseActivityForm(input: unknown): ActivityFormState {
  const result = activityFormSchema.safeParse(input);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: {},
    };
  }

  return {
    success: false,
    data: null,
    errors: result.error.flatten().fieldErrors,
  };
}

export function parseActivityFormData(formData: FormData) {
  return parseActivityForm({
    title: formData.get(FORM_FIELDS.title),
    description: formData.get(FORM_FIELDS.description),
    priority: formData.get(FORM_FIELDS.priority),
    category: formData.get(FORM_FIELDS.category),
    team: formData.get(FORM_FIELDS.team),
    assignee: formData.get(FORM_FIELDS.assignee),
    status: formData.get(FORM_FIELDS.status),
  });
}
