import { type ActivityFormInput } from "./validation";

const trackedFields: (keyof ActivityFormInput)[] = [
  "title",
  "description",
  "priority",
  "category",
  "team",
  "assignee",
  "status",
];

export function summarizeActivityUpdate(
  before: ActivityFormInput,
  after: ActivityFormInput,
) {
  const changedFields = trackedFields.filter((field) => before[field] !== after[field]);

  if (changedFields.length === 0) {
    return "No tracked fields changed.";
  }

  return `Changed ${changedFields.join(", ")}.`;
}
