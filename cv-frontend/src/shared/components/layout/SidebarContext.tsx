"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  defaultCollapsed,
}: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (defaultCollapsed !== undefined) {
      return defaultCollapsed;
    }
    if (typeof window !== "undefined") {
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
    }
    return false;
  });

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

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (stored !== null) {
          setIsCollapsed(stored === "true");
        }
      } catch {
        // Ignore storage access errors
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(CHANGE_EVENT, handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(CHANGE_EVENT, handleStorageChange);
    };
  }, []);

  const handleSetIsCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
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
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
          document.cookie = `${SIDEBAR_COOKIE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`;
        } catch {
          // Ignore storage access errors
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
      }
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed: handleSetIsCollapsed,
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
