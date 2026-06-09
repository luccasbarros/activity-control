import { describe, expect, it } from "vitest";
import { signSessionToken, verifySessionToken } from "./session";

const sessionPayload = {
  userId: "user_123",
  email: "admin@example.com",
  name: "Demo Admin",
};

describe("session tokens", () => {
  it("round-trips a signed session payload", () => {
    const token = signSessionToken(sessionPayload, "test-secret");

    expect(verifySessionToken(token, "test-secret")).toEqual(sessionPayload);
  });

  it("rejects tampered tokens", () => {
    const token = signSessionToken(sessionPayload, "test-secret");
    const tampered = token.replace("user_123", "user_999");

    expect(verifySessionToken(tampered, "test-secret")).toBeNull();
  });

  it("rejects tokens signed with a different secret", () => {
    const token = signSessionToken(sessionPayload, "test-secret");

    expect(verifySessionToken(token, "other-secret")).toBeNull();
  });
});
