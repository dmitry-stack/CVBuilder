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
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return defaultCollapsed;
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item === null) return defaultCollapsed;
      return item === "true";
    } catch {
      return defaultCollapsed;
    }
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

  const setIsCollapsed = useCallback((collapsed: boolean) => {
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
