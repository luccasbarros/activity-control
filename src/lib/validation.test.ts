import { ActivityStatus, Category, Priority } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { activityFormSchema, parseActivityForm } from "./validation";

const validInput = {
  title: "Investigate billing webhook",
  description: "Review failed webhook retries and document the recovery path.",
  priority: Priority.HIGH,
  category: Category.BUG,
  team: "Platform",
  assignee: "Alex Morgan",
  status: ActivityStatus.IN_PROGRESS,
};

describe("activity validation", () => {
  it("accepts a complete activity payload", () => {
    const parsed = activityFormSchema.parse(validInput);

    expect(parsed).toEqual(validInput);
  });

  it("rejects empty required fields with field-level errors", () => {
    const result = parseActivityForm({
      ...validInput,
      title: "",
      team: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.title).toContain("Title is required.");
      expect(result.errors.team).toContain("Team is required.");
    }
  });

  it("rejects invalid enum values", () => {
    const result = parseActivityForm({
      ...validInput,
      priority: "URGENT",
      status: "WAITING",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.priority).toContain("Select a valid priority.");
      expect(result.errors.status).toContain("Select a valid status.");
    }
  });
});
