import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCurrentUser } from "./get-current-user.server";

const mockCookieSet = vi.fn();
const mockCookieDelete = vi.fn();
const mockCookieGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      set: mockCookieSet,
      delete: mockCookieDelete,
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

  it("returns null when neither access_token nor refresh_token exists", async () => {
    mockCookieGet.mockReturnValue(undefined);

    const result = await getCurrentUser();
    expect(result).toBeNull();
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  it("returns user data when access_token is valid", async () => {
    mockCookieGet.mockImplementation((name: string) => {
      if (name === "access_token") return { value: "valid-access-token" };
      return undefined;
    });

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
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  it("refreshes tokens and returns user when access_token is missing but refresh_token is present", async () => {
    mockCookieGet.mockImplementation((name: string) => {
      if (name === "refresh_token") return { value: "valid-refresh-token" };
      return undefined;
    });

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              updateToken: {
                access_token: "new-access-token",
                refresh_token: "new-refresh-token",
              },
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              me: {
                id: "user-1",
                email: "refreshed@example.com",
              },
            },
          }),
      });

    const result = await getCurrentUser();
    expect(result).toEqual({
      id: "user-1",
      email: "refreshed@example.com",
    });
    expect(mockCookieSet).toHaveBeenCalledWith(
      "access_token",
      "new-access-token",
      expect.objectContaining({ httpOnly: true }),
    );
    expect(mockCookieSet).toHaveBeenCalledWith(
      "refresh_token",
      "new-refresh-token",
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it("attempts token refresh when access_token query returns no user data", async () => {
    mockCookieGet.mockImplementation((name: string) => {
      if (name === "access_token") return { value: "expired-access-token" };
      if (name === "refresh_token") return { value: "valid-refresh-token" };
      return undefined;
    });

    // 1st fetch: Me query with expired token -> returns null data / errors
    // 2nd fetch: UpdateToken query -> returns new tokens
    // 3rd fetch: Me query with new access token -> returns me
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "Unauthorized" }],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              updateToken: {
                access_token: "fresh-access-token",
                refresh_token: "fresh-refresh-token",
              },
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              me: {
                id: "user-1",
                email: "refreshed@example.com",
              },
            },
          }),
      });

    const result = await getCurrentUser();
    expect(result).toEqual({
      id: "user-1",
      email: "refreshed@example.com",
    });
    expect(mockCookieSet).toHaveBeenCalledWith(
      "access_token",
      "fresh-access-token",
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it("clears auth cookies and returns null when refresh fails", async () => {
    mockCookieGet.mockImplementation((name: string) => {
      if (name === "refresh_token") return { value: "invalid-refresh-token" };
      return undefined;
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          errors: [{ message: "Invalid refresh token" }],
        }),
    });

    const result = await getCurrentUser();
    expect(result).toBeNull();
    expect(mockCookieDelete).toHaveBeenCalledWith("access_token");
    expect(mockCookieDelete).toHaveBeenCalledWith("refresh_token");
  });
});
