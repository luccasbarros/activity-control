import { describe, expect, it } from "vitest";
import { getPaginationState, parsePaginationParams } from "./pagination";

describe("pagination", () => {
  it("parses valid page and page size values", () => {
    expect(parsePaginationParams({ page: "3", pageSize: "10" })).toEqual({
      page: 3,
      pageSize: 10,
    });
  });

  it("falls back when page or page size values are invalid", () => {
    expect(parsePaginationParams({ page: "-2", pageSize: "99" })).toEqual({
      page: 1,
      pageSize: 5,
    });
  });

  it("calculates skip, range, and total pages", () => {
    expect(
      getPaginationState({
        totalItems: 42,
        requestedPage: 3,
        pageSize: 10,
      }),
    ).toEqual({
      currentPage: 3,
      pageSize: 10,
      totalItems: 42,
      totalPages: 5,
      skip: 20,
      take: 10,
      itemStart: 21,
      itemEnd: 30,
      hasPreviousPage: true,
      hasNextPage: true,
    });
  });

  it("clamps requests beyond the last page", () => {
    expect(
      getPaginationState({
        totalItems: 6,
        requestedPage: 4,
        pageSize: 5,
      }),
    ).toMatchObject({
      currentPage: 2,
      totalPages: 2,
      skip: 5,
      itemStart: 6,
      itemEnd: 6,
      hasPreviousPage: true,
      hasNextPage: false,
    });
  });
});
