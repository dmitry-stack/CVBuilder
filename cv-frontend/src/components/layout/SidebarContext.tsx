"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  SIDEBAR_STORAGE_KEY,
  SIDEBAR_COOKIE_KEY,
} from "./sidebar.constants";

export { SIDEBAR_STORAGE_KEY, SIDEBAR_COOKIE_KEY };
const CHANGE_EVENT = "cv_sidebar_change";


interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapse: () => void;
}

export interface SidebarProviderProps {
  children: ReactNode;
  defaultCollapsed?: boolean;
}

function subscribeSidebar(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  toggleCollapse: () => {},
});

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const getSnapshot = useCallback(() => {


    if (typeof window === "undefined") return defaultCollapsed;
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored !== null) {
        return stored === "true";
      }
    } catch {
      // Ignore storage access errors
    }
    const cookieVal = getCookie(SIDEBAR_COOKIE_KEY);
    if (cookieVal !== null) {
      return cookieVal === "true";
    }
    return defaultCollapsed;
  }, [defaultCollapsed]);

  const getServerSnapshot = useCallback(
    () => defaultCollapsed,
    [defaultCollapsed],
  );

  const isCollapsed = useSyncExternalStore(
    subscribeSidebar,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored !== null) {
        document.cookie = `${SIDEBAR_COOKIE_KEY}=${stored}; path=/; max-age=31536000; SameSite=Lax`;
      } else {
        const cookieVal = getCookie(SIDEBAR_COOKIE_KEY);
        if (cookieVal !== null) {
          localStorage.setItem(SIDEBAR_STORAGE_KEY, cookieVal);
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setIsCollapsed = useCallback((collapsed: boolean) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
        document.cookie = `${SIDEBAR_COOKIE_KEY}=${collapsed}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // Ignore storage access errors
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!getSnapshot());
  }, [setIsCollapsed, getSnapshot]);

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

