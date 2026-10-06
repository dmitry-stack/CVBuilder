"use client";

import { ReactNode, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { UnsupportedDeviceView } from "./UnsupportedDeviceView";

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mql = window.matchMedia(MOBILE_MEDIA_QUERY);
  mql.addEventListener("change", callback);
  return () => {
    mql.removeEventListener("change", callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function DeviceGuard({ children }: { children: ReactNode }) {
  const isMobile = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const pathname = usePathname();

  if (isMobile && pathname !== "/unsupported-device") {
    return (
      <main
        data-slot="device-guard-unsupported"
        className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-[#2E2E2E]"
      >
        <UnsupportedDeviceView />
      </main>
    );
  }

  return <>{children}</>;
}
