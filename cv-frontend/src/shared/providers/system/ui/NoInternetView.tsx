"use client";

import { Button } from "@/shared/components/ui/button";

interface NoInternetViewProps {
  onRetry?: () => void;
  isOverlay?: boolean;
}

function NoInternetIllustration({ className }: { className?: string }) {
  return (
    <svg
      width={162}
      height={122}
      viewBox="0 0 162 122"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="No internet connection"
      className={className}
    >
      <path
        d="M151 1H11C5.47715 1 1 5.47715 1 11V91C1 96.5229 5.47715 101 11 101H151C156.523 101 161 96.5229 161 91V11C161 5.47715 156.523 1 151 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56 39C57.6569 39 59 37.6569 59 36C59 34.3431 57.6569 33 56 33C54.3431 33 53 34.3431 53 36C53 37.6569 54.3431 39 56 39Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M106 39C107.657 39 109 37.6569 109 36C109 34.3431 107.657 33 106 33C104.343 33 103 34.3431 103 36C103 37.6569 104.343 39 106 39Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M51 66C71 52.6667 91 52.6667 111 66"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M61 101L51 121H111L101 101"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41 121H121"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NoInternetView({
  onRetry,
  isOverlay = false,
}: NoInternetViewProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const containerClasses = isOverlay
    ? "p-8 max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
    : "min-h-[70vh] flex-1 max-w-lg w-full bg-white dark:bg-[#2E2E2E]";

  return (
    <div
      role="alert"
      aria-live="polite"
      data-slot="no-internet-view"
      className={`flex flex-col items-center justify-center text-center font-roboto ${containerClasses}`}
    >
      <NoInternetIllustration className="mb-6 max-w-full h-auto text-[#2E2E2E] dark:text-zinc-100" />

      <h1 className="text-3xl font-medium text-[#2E2E2E] dark:text-zinc-100 mb-3">
        Oops
      </h1>

      <p className="max-w-md text-sm text-[#2E2E2E] dark:text-zinc-300 leading-relaxed mb-6">
        Something went wrong. We&apos;re already working on fixing it.
        <br />
        Please try again.
      </p>

      <Button
        type="button"
        size="lg"
        onClick={handleRetry}
        className="min-w-40 shadow-md"
      >
        RETRY
      </Button>
    </div>
  );
}
