import { describe, expect, it } from "vitest";
import { getNotification } from "./notifications";

describe("notifications", () => {
  it("returns success messages for known notices", () => {
    expect(getNotification({ notice: "activity-created" })).toEqual({
      type: "success",
      message: "Activity created.",
    });
  });

  it("prefers error messages over notices", () => {
    expect(
      getNotification({
        error: "Activity not found.",
        notice: "activity-updated",
      }),
    ).toEqual({
      type: "error",
      message: "Activity not found.",
    });
  });

  it("ignores unknown notices", () => {
    expect(getNotification({ notice: "unknown" })).toBeNull();
  });
});
