import { afterEach, describe, expect, it, vi } from "vitest";
import { getSessionSecret, signSessionToken, verifySessionToken } from "./session";

const sessionPayload = {
  userId: "user_123",
  email: "admin@example.com",
  name: "Demo Admin",
  expiresAt: Date.now() + 60_000,
};

describe("session tokens", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires an explicit production session secret", () => {
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv("NODE_ENV", "production");

    expect(() => getSessionSecret()).toThrow("AUTH_SECRET must be set");
  });

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

  it("rejects expired tokens", () => {
    const token = signSessionToken(
      {
        ...sessionPayload,
        expiresAt: Date.now() - 1_000,
      },
      "test-secret",
    );

    expect(verifySessionToken(token, "test-secret")).toBeNull();
  });
});
