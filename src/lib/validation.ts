import { ActivityStatus, Category, Priority } from "@prisma/client";
import { z } from "zod";

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
    .min(1, "Title is required.")
    .min(3, "Title must have at least 3 characters.")
    .max(120, "Title must have at most 120 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .min(3, "Description must have at least 3 characters.")
    .max(1000, "Description must have at most 1000 characters."),
  priority: z.enum(priorityValues, {
    errorMap: () => ({ message: "Select a valid priority." }),
  }),
  category: z.enum(categoryValues, {
    errorMap: () => ({ message: "Select a valid category." }),
  }),
  team: z
    .string()
    .trim()
    .min(1, "Team is required.")
    .min(2, "Team must have at least 2 characters.")
    .max(80, "Team must have at most 80 characters."),
  assignee: z
    .string()
    .trim()
    .min(1, "Assignee is required.")
    .min(2, "Assignee must have at least 2 characters.")
    .max(80, "Assignee must have at most 80 characters."),
  status: z.enum(statusValues, {
    errorMap: () => ({ message: "Select a valid status." }),
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
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    category: formData.get("category"),
    team: formData.get("team"),
    assignee: formData.get("assignee"),
    status: formData.get("status"),
  });
}
