import { describe, expect, it } from "vitest";
import {
  buildActivityListPath,
  sanitizeReturnTo,
  withQueryMessage,
} from "./navigation";

describe("navigation helpers", () => {
  it("builds list paths while removing transient messages", () => {
    const path = buildActivityListPath({
      priority: "HIGH",
      team: "Platform",
      page: "2",
      pageSize: "10",
      notice: "activity-created",
    });

    expect(path).toBe(
      "/activities?priority=HIGH&team=Platform&page=2&pageSize=10",
    );
  });

  it("uses compact defaults for the first page and default page size", () => {
    const path = buildActivityListPath({
      page: "1",
      pageSize: "5",
      assignee: "Alex",
    });

    expect(path).toBe("/activities?assignee=Alex");
  });

  it("sanitizes return paths to local activity list paths", () => {
    expect(sanitizeReturnTo("/?page=2&notice=activity-updated")).toBe("/?page=2");
    expect(sanitizeReturnTo("https://example.com")).toBe("/dashboard");
    expect(sanitizeReturnTo("//example.com")).toBe("/dashboard");
  });

  it("adds one query message without preserving stale messages", () => {
    expect(
      withQueryMessage("/?page=2&error=Old", {
        key: "notice",
        value: "activity-deleted",
      }),
    ).toBe("/?page=2&notice=activity-deleted");
  });
});
