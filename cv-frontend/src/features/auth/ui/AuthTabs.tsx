"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AuthTabs() {
  const pathname = usePathname();
  const isSignIn = pathname === "/signin";
  const isSignUp = pathname === "/signup";

  return (
    <header className="flex h-14 w-full justify-center">
      <nav aria-label="Authentication" className="flex h-12 items-center">
        <div className="flex h-12 w-auth-tab flex-col items-center justify-end">
          <Link
            href="/signin"
            className={cn(
              "flex h-auth-link w-full items-center justify-center text-center font-roboto text-sm leading-cv-label uppercase tracking-cv-wide transition-colors",
              isSignIn
                ? "font-semibold text-cv-accent"
                : "font-medium text-cv-text hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
            aria-current={isSignIn ? "page" : undefined}
          >
            SIGN IN
          </Link>
          <div
            className={cn(
              "h-auth-rule w-auth-tab transition-colors",
              isSignIn ? "bg-cv-accent" : "bg-transparent",
            )}
          />
        </div>

        <div className="flex h-12 w-auth-tab flex-col items-center justify-end">
          <Link
            href="/signup"
            className={cn(
              "flex h-auth-link w-full items-center justify-center text-center font-roboto text-sm leading-cv-label uppercase tracking-cv-wide transition-colors",
              isSignUp
                ? "font-semibold text-cv-accent"
                : "font-medium text-cv-text hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
            aria-current={isSignUp ? "page" : undefined}
          >
            SIGN UP
          </Link>
          <div
            className={cn(
              "h-auth-rule w-auth-tab transition-colors",
              isSignUp ? "bg-cv-accent" : "bg-transparent",
            )}
          />
        </div>
      </nav>
    </header>
  );
}
