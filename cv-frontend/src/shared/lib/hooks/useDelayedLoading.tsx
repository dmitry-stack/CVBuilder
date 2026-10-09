import { useEffect, useState } from "react";

export function useDelayedLoading(loading: boolean, delayMs = 200): boolean {
  const [showLoading, setShowLoading] = useState(false);
  const [prevLoading, setPrevLoading] = useState(loading);

  if (prevLoading !== loading) {
    setPrevLoading(loading);
    if (!loading) {
      setShowLoading(false);
    }
  }

  useEffect(() => {
    if (!loading) return;

    const timer = setTimeout(() => setShowLoading(true), delayMs);
    return () => clearTimeout(timer);
  }, [loading, delayMs]);

  return loading ? showLoading : false;
}
