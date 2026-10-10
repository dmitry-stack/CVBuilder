import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCurrentUser } from "./get-current-user.server";

const mockCookieGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: mockCookieGet,
    }),
}));

describe("getCurrentUser server action", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns null when access_token is missing", async () => {
    mockCookieGet.mockReturnValue(undefined);

    const result = await getCurrentUser();
    expect(result).toBeNull();
  });

  it("returns user data when access_token is valid", async () => {
    mockCookieGet.mockReturnValue({ value: "valid-access-token" });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            me: {
              id: "user-1",
              email: "test@example.com",
              first_name: "John",
              last_name: "Doe",
            },
          },
        }),
    });

    const result = await getCurrentUser();
    expect(result).toEqual({
      id: "user-1",
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe",
    });
  });

  it("returns null when fetch returns error or null data", async () => {
    mockCookieGet.mockReturnValue({ value: "expired-token" });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          errors: [{ message: "Unauthorized" }],
        }),
    });

    const result = await getCurrentUser();
    expect(result).toBeNull();
  });

  it("returns null when fetch throws network error", async () => {
    mockCookieGet.mockReturnValue({ value: "broken-token" });

    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await getCurrentUser();
    expect(result).toBeNull();
  });
});
