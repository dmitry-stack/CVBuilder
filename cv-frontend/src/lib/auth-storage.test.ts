import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Cookies from "js-cookie";
import { authStorage } from "./auth-storage";

describe("authStorage", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("stores access token in cookies and syncs with session endpoint", () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    global.fetch = mockFetch;

    authStorage.setTokens("access-123", "refresh-456");

    expect(Cookies.get("access_token")).toBe("access-123");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          access_token: "access-123",
          refresh_token: "refresh-456",
        }),
      }),
    );
  });

  it("retrieves the current access token", () => {
    Cookies.set("access_token", "my-test-token");
    expect(authStorage.getAccessToken()).toBe("my-test-token");
  });

  it("clears tokens from cookies and deletes session on server", () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    global.fetch = mockFetch;

    Cookies.set("access_token", "to-be-cleared");
    authStorage.clearTokens();

    expect(Cookies.get("access_token")).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });

  it("refreshes tokens via /api/auth/refresh and updates cookies", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access_token: "new-access-token" }),
    });
    global.fetch = mockFetch;

    const token = await authStorage.refreshTokens();

    expect(token).toBe("new-access-token");
    expect(Cookies.get("access_token")).toBe("new-access-token");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/refresh",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("deduplicates multiple concurrent refreshTokens calls into one request", async () => {
    const mockFetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ access_token: "shared-token" }),
              }),
            50,
          ),
        ),
    );
    global.fetch = mockFetch;

    const [token1, token2, token3] = await Promise.all([
      authStorage.refreshTokens(),
      authStorage.refreshTokens(),
      authStorage.refreshTokens(),
    ]);

    expect(token1).toBe("shared-token");
    expect(token2).toBe("shared-token");
    expect(token3).toBe("shared-token");
    // Only 1 fetch call made despite 3 concurrent calls
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
