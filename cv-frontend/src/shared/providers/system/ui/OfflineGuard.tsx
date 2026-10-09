"use client";

import { ReactNode, useSyncExternalStore } from "react";
import { NoInternetView } from "./NoInternetView";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot(): boolean {
  if (typeof navigator === "undefined") {
    return true;
  }
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

export function OfflineGuard({ children }: { children: ReactNode }) {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!isOnline) {
    return (
      <div
        data-slot="offline-guard-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-zinc-900"
      >
        <NoInternetView onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return <>{children}</>;
}
