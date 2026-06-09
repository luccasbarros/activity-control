import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
  it("verifies the original password against its hash", () => {
    const result = hashPassword("demo-password");

    expect(result.passwordHash).not.toBe("demo-password");
    expect(result.passwordSalt.length).toBeGreaterThan(20);
    expect(verifyPassword("demo-password", result)).toBe(true);
  });

  it("rejects a different password", () => {
    const result = hashPassword("demo-password");

    expect(verifyPassword("wrong-password", result)).toBe(false);
  });
});
