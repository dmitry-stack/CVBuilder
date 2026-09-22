import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useCurrentUser } from "./useCurrentUser";
import { useQuery } from "@apollo/client/react";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

describe("useCurrentUser", () => {
  it("returns current user and ownership status correctly", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: {
        me: {
          id: "123",
          email: "user@example.com",
          first_name: "Jane",
          last_name: "Doe",
          role: "Employee",
          avatar: null,
        },
      },
      loading: false,
      error: undefined,
    } as unknown as ReturnType<typeof useQuery>);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.currentUserId).toBe("123");
    expect(result.current.currentUser?.email).toBe("user@example.com");
    expect(result.current.isOwnProfile("123")).toBe(true);
    expect(result.current.isOwnProfile("456")).toBe(false);
    expect(result.current.isOwnProfile(null)).toBe(false);
  });

  it("handles loading and unauthenticated states", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      loading: true,
      error: undefined,
    } as unknown as ReturnType<typeof useQuery>);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.loading).toBe(true);
    expect(result.current.currentUserId).toBeUndefined();
    expect(result.current.isOwnProfile("123")).toBe(false);
  });
});
