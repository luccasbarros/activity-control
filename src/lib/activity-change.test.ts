import { ActivityStatus, Category, Priority } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { summarizeActivityUpdate } from "./activity-change";

const baseActivity = {
  title: "Investigate webhook retries",
  description: "Review failed retries and document recovery.",
  priority: Priority.MEDIUM,
  category: Category.SUPPORT,
  team: "Platform",
  assignee: "Alex Morgan",
  status: ActivityStatus.PENDING,
};

describe("activity change summaries", () => {
  it("lists changed fields in a stable summary", () => {
    const summary = summarizeActivityUpdate(baseActivity, {
      ...baseActivity,
      priority: Priority.HIGH,
      status: ActivityStatus.IN_PROGRESS,
      assignee: "Marina Costa",
    });

    expect(summary).toBe("Changed priority, assignee, status.");
  });

  it("returns a no-op summary when no tracked fields changed", () => {
    const summary = summarizeActivityUpdate(baseActivity, { ...baseActivity });

    expect(summary).toBe("No tracked fields changed.");
  });
});
