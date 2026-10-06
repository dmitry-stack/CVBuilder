"use client";

import Image from "next/image";
import errorSvg from "@/assets/error.svg";

interface NoInternetViewProps {
  onRetry?: () => void;
  isOverlay?: boolean;
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
    ? "p-8 max-w-md w-full bg-[#F5F5F7] dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
    : "min-h-[70vh] flex-1 max-w-lg w-full";

  return (
    <div
      role="alert"
      aria-live="polite"
      data-slot="no-internet-view"
      className={`flex flex-col items-center justify-center text-center font-roboto ${containerClasses}`}
    >
      <Image
        src={errorSvg}
        alt="Error"
        width={162}
        height={122}
        priority
        className="mb-6 max-w-full h-auto dark:invert dark:brightness-200"
      />

      <h1 className="text-3xl font-medium text-[#2E2E2E] dark:text-zinc-100 mb-3">
        Oops
      </h1>

      <p className="max-w-md text-sm text-[#2E2E2E] dark:text-zinc-300 leading-relaxed mb-6">
        Something went wrong. We&apos;re already working on fixing it.
        <br />
        Please try again or go back.
      </p>

      <button
        type="button"
        onClick={handleRetry}
        className="h-10 min-w-[160px] px-8 rounded-[40px] bg-cv-accent hover:bg-cv-accent-hover text-white text-sm font-medium tracking-wide uppercase transition-colors cursor-pointer shadow-md"
      >
        RETRY
      </button>
    </div>
  );
}
