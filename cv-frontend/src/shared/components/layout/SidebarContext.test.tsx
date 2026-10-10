import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  SidebarProvider,
  useSidebarContext,
  SIDEBAR_STORAGE_KEY,
  SIDEBAR_COOKIE_KEY,
} from "./SidebarContext";

describe("SidebarContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = `${SIDEBAR_COOKIE_KEY}=; max-age=0; path=/`;
    vi.clearAllMocks();
  });

  it("provides default collapsed state as false", () => {
    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    expect(result.current.isCollapsed).toBe(false);
  });

  it("initializes from defaultCollapsed prop when provided", () => {
    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: ({ children }) => (
        <SidebarProvider defaultCollapsed={true}>{children}</SidebarProvider>
      ),
    });

    expect(result.current.isCollapsed).toBe(true);
  });

  it("toggles collapsed state and updates localStorage and document.cookie", () => {
    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    act(() => {
      result.current.toggleCollapse();
    });

    expect(result.current.isCollapsed).toBe(true);
    expect(localStorage.getItem(SIDEBAR_STORAGE_KEY)).toBe("true");
    expect(document.cookie).toContain(`${SIDEBAR_COOKIE_KEY}=true`);

    act(() => {
      result.current.toggleCollapse();
    });

    expect(result.current.isCollapsed).toBe(false);
    expect(localStorage.getItem(SIDEBAR_STORAGE_KEY)).toBe("false");
    expect(document.cookie).toContain(`${SIDEBAR_COOKIE_KEY}=false`);
  });

  it("sets collapsed state explicitly via setIsCollapsed and updates cookie", () => {
    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    act(() => {
      result.current.setIsCollapsed(true);
    });

    expect(result.current.isCollapsed).toBe(true);
    expect(localStorage.getItem(SIDEBAR_STORAGE_KEY)).toBe("true");
    expect(document.cookie).toContain(`${SIDEBAR_COOKIE_KEY}=true`);
  });

  it("initializes from localStorage if stored value is true", () => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, "true");

    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    expect(result.current.isCollapsed).toBe(true);
  });

  it("initializes from document.cookie when localStorage is absent", () => {
    document.cookie = `${SIDEBAR_COOKIE_KEY}=true; path=/`;

    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    expect(result.current.isCollapsed).toBe(true);
  });

  it("syncs localStorage to document.cookie on mount", () => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, "true");

    renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    expect(document.cookie).toContain(`${SIDEBAR_COOKIE_KEY}=true`);
  });
});
