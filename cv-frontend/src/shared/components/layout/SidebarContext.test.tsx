import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { SidebarProvider, useSidebarContext } from "./SidebarContext";

describe("SidebarContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("provides default collapsed state as false", () => {
    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    expect(result.current.isCollapsed).toBe(false);
  });

  it("toggles collapsed state and updates localStorage", () => {
    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    act(() => {
      result.current.toggleCollapse();
    });

    expect(result.current.isCollapsed).toBe(true);
    expect(localStorage.getItem("cv_sidebar_collapsed")).toBe("true");

    act(() => {
      result.current.toggleCollapse();
    });

    expect(result.current.isCollapsed).toBe(false);
    expect(localStorage.getItem("cv_sidebar_collapsed")).toBe("false");
  });

  it("sets collapsed state explicitly via setIsCollapsed", () => {
    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    act(() => {
      result.current.setIsCollapsed(true);
    });

    expect(result.current.isCollapsed).toBe(true);
    expect(localStorage.getItem("cv_sidebar_collapsed")).toBe("true");
  });

  it("initializes from localStorage if stored value is true", () => {
    localStorage.setItem("cv_sidebar_collapsed", "true");

    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: SidebarProvider,
    });

    expect(result.current.isCollapsed).toBe(true);
  });

  it("respects defaultCollapsed prop", () => {
    const { result } = renderHook(() => useSidebarContext(), {
      wrapper: ({ children }) => (
        <SidebarProvider defaultCollapsed={true}>{children}</SidebarProvider>
      ),
    });

    expect(result.current.isCollapsed).toBe(true);
  });
});
