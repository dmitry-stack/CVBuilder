import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDelayedLoading } from "./useDelayedLoading";

describe("useDelayedLoading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false immediately when loading is false", () => {
    const { result } = renderHook(() => useDelayedLoading(false, 200));
    expect(result.current).toBe(false);
  });

  it("returns false initially when loading is true before delayMs expires", () => {
    const { result } = renderHook(() => useDelayedLoading(true, 200));
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(false);
  });

  it("returns true after delayMs expires when loading is true", () => {
    const { result } = renderHook(() => useDelayedLoading(true, 200));
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe(true);
  });

  it("resets to false immediately when loading transitions from true to false", () => {
    let loading = true;
    const { result, rerender } = renderHook(() =>
      useDelayedLoading(loading, 200),
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe(true);

    loading = false;
    rerender();
    expect(result.current).toBe(false);
  });

  it("does not turn true if loading becomes false before delayMs expires", () => {
    let loading = true;
    const { result, rerender } = renderHook(() =>
      useDelayedLoading(loading, 200),
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(false);

    loading = false;
    rerender();

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe(false);
  });
});
