"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapse: () => void;
}

const STORAGE_KEY = "cv_sidebar_collapsed";
const CHANGE_EVENT = "cv_sidebar_change";

function subscribeSidebar(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSidebarSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  toggleCollapse: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isCollapsed = useSyncExternalStore(
    subscribeSidebar,
    getSidebarSnapshot,
    getServerSnapshot,
  );

  const setIsCollapsed = useCallback((collapsed: boolean) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, String(collapsed));
      } catch {
        // Ignore storage access errors
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!getSidebarSnapshot());
  }, [setIsCollapsed]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleCollapse,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  return useContext(SidebarContext);
}
