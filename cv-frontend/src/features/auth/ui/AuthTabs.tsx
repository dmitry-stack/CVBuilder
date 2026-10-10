"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "@/i18n";

export function AuthTabs() {
  const pathname = usePathname();
  const isSignIn = pathname.endsWith("/signin");
  const isSignUp = pathname.endsWith("/signup");
  const { t } = useTranslation();

  return (
    <header className="flex h-14 w-full justify-center">
      <nav
        aria-label="Authentication"
        className="relative flex h-12 items-center"
      >
        <div className="flex h-12 w-auth-tab flex-col items-center justify-end">
          <Link
            href="/signin"
            className={cn(
              "flex h-auth-link w-full items-center justify-center text-center font-roboto text-sm leading-cv-label uppercase tracking-cv-wide transition-colors duration-200",
              isSignIn
                ? "font-semibold text-cv-accent"
                : "font-medium text-cv-text hover:text-black dark:text-[#F5F5F7] dark:hover:text-white",
            )}
            aria-current={isSignIn ? "page" : undefined}
          >
            {t("auth.signIn")}
          </Link>
        </div>

        <div className="flex h-12 w-auth-tab flex-col items-center justify-end">
          <Link
            href="/signup"
            className={cn(
              "flex h-auth-link w-full items-center justify-center text-center font-roboto text-sm leading-cv-label uppercase tracking-cv-wide transition-colors duration-200",
              isSignUp
                ? "font-semibold text-cv-accent"
                : "font-medium text-cv-text hover:text-black dark:text-[#F5F5F7] dark:hover:text-white",
            )}
            aria-current={isSignUp ? "page" : undefined}
          >
            {t("auth.signUp")}
          </Link>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 h-auth-rule w-auth-tab bg-cv-accent",
            "transition-transform duration-300 ease-out",
            isSignUp ? "translate-x-full" : "translate-x-0",
            !isSignIn && !isSignUp && "opacity-0",
          )}
        />
      </nav>
    </header>
  );
}
