"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  userId: string;
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "PROFILE",
      href: `/users/${userId}/profile`,
      isActive:
        pathname === `/users/${userId}/profile` ||
        pathname === `/users/${userId}`,
    },
    {
      label: "SKILLS",
      href: `/users/${userId}/skills`,
      isActive: pathname === `/users/${userId}/skills`,
    },
    {
      label: "LANGUAGES",
      href: `/users/${userId}/languages`,
      isActive: pathname === `/users/${userId}/languages`,
    },
  ];

  return (
    <nav
      aria-label="User profile navigation"
      className="flex h-12 border-b border-zinc-200 dark:border-zinc-800 "
    >
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className="flex h-12 w-auth-tab shrink-0 flex-col items-center justify-end"
        >
          <Link
            href={tab.href}
            className={cn(
              "flex h-auth-link w-full items-center justify-center text-center font-roboto text-sm leading-cv-label uppercase tracking-cv-wide transition-colors",
              tab.isActive
                ? "font-semibold text-cv-accent"
                : "font-medium text-cv-text hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
            aria-current={tab.isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
          <div
            className={cn(
              "h-auth-rule w-auth-tab transition-colors",
              tab.isActive ? "bg-cv-accent" : "bg-transparent",
            )}
          />
        </div>
      ))}
    </nav>
  );
}
