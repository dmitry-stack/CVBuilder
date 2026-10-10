"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapse: () => void;
}

const STORAGE_KEY = "cv_sidebar_collapsed";
const CHANGE_EVENT = "cv_sidebar_change";

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  toggleCollapse: () => {},
});

interface SidebarProviderProps {
  children: ReactNode;
  defaultCollapsed?: boolean;
}

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
        const item = localStorage.getItem(STORAGE_KEY);
        if (item !== null) return item === "true";
      } catch {
        // Ignore storage access errors
      }
    }
    return false;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
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
        localStorage.setItem(STORAGE_KEY, String(collapsed));
        document.cookie = `${STORAGE_KEY}=${collapsed}; path=/; max-age=31536000; SameSite=Lax`;
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
          localStorage.setItem(STORAGE_KEY, String(next));
          document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`;
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
