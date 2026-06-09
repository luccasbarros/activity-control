import { Category, Priority } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { buildActivityWhereInput, parseActivityFilters } from "./filters";

describe("activity filters", () => {
  it("parses valid filters from URL search params", () => {
    const filters = parseActivityFilters({
      priority: Priority.HIGH,
      category: Category.FEATURE,
      team: "Product",
      assignee: "Alex",
    });

    expect(filters).toEqual({
      priority: Priority.HIGH,
      category: Category.FEATURE,
      team: "Product",
      assignee: "Alex",
    });
  });

  it("ignores invalid enum filters and blank text filters", () => {
    const filters = parseActivityFilters({
      priority: "URGENT",
      category: "",
      team: "   ",
      assignee: "Marina",
    });

    expect(filters).toEqual({
      assignee: "Marina",
    });
  });

  it("builds a combined Prisma where input", () => {
    const where = buildActivityWhereInput({
      priority: Priority.CRITICAL,
      category: Category.BUG,
      team: "Platform",
      assignee: "Marina",
    });

    expect(where).toEqual({
      priority: Priority.CRITICAL,
      category: Category.BUG,
      team: { contains: "Platform" },
      assignee: { contains: "Marina" },
    });
  });
});
