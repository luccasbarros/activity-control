import { ActivityStatus, Category, Priority } from "@prisma/client";

export const priorityOptions = [
  { value: Priority.LOW, label: "Low" },
  { value: Priority.MEDIUM, label: "Medium" },
  { value: Priority.HIGH, label: "High" },
  { value: Priority.CRITICAL, label: "Critical" },
] as const;

export const categoryOptions = [
  { value: Category.BUG, label: "Bug" },
  { value: Category.FEATURE, label: "Feature" },
  { value: Category.IMPROVEMENT, label: "Improvement" },
  { value: Category.SUPPORT, label: "Support" },
  { value: Category.OPERATIONAL, label: "Operational" },
] as const;

export const statusOptions = [
  { value: ActivityStatus.PENDING, label: "Pending" },
  { value: ActivityStatus.IN_PROGRESS, label: "In progress" },
  { value: ActivityStatus.DONE, label: "Done" },
  { value: ActivityStatus.BLOCKED, label: "Blocked" },
] as const;

export function getLabel<TValue extends string>(
  options: readonly { value: TValue; label: string }[],
  value: TValue,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}
