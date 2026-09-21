"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, User } from "lucide-react";
import { useHeaderContext } from "./HeaderContext";

export function Header() {
  const pathname = usePathname() || "";
  const { userName: contextUserName } = useHeaderContext();

  const userMatch = pathname.match(/^\/users\/([^/]+)(?:\/([^/]+))?$/);

  if (userMatch) {
    const [, userId, subRoute] = userMatch;
    if (userId && userId !== "loading") {
      const userName = contextUserName || "Rostislav Harlanov";

      let subPageTitle = "Profile";
      if (subRoute === "skills") subPageTitle = "Skills";
      else if (subRoute === "languages") subPageTitle = "Languages";
      else if (subRoute === "cvs") subPageTitle = "CVs";

      return (
        <header
          data-slot="app-header"
          aria-label="Breadcrumb"
          className="h-14 px-6 flex items-center text-sm font-roboto text-zinc-600 dark:text-zinc-400"
        >
          <nav
            aria-label="Breadcrumb navigation"
            className="flex items-center gap-2"
          >
            <Link
              href="/users"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Employees
            </Link>

            <ChevronRight
              className="h-4 w-4 text-zinc-400 dark:text-zinc-600 shrink-0"
              aria-hidden="true"
            />

            <span className="inline-flex items-center gap-1.5 font-medium text-cv-accent">
              <User className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{userName}</span>
            </span>

            <ChevronRight
              className="h-4 w-4 text-zinc-400 dark:text-zinc-600 shrink-0"
              aria-hidden="true"
            />

            <span className="text-zinc-400 dark:text-zinc-500">
              {subPageTitle}
            </span>
          </nav>
        </header>
      );
    }
  }

  let headerTitle = "Employees";
  if (pathname.startsWith("/skills")) {
    headerTitle = "Skills";
  } else if (pathname.startsWith("/languages")) {
    headerTitle = "Languages";
  } else if (pathname.startsWith("/cvs")) {
    headerTitle = "CVs";
  } else if (pathname.startsWith("/settings")) {
    headerTitle = "Settings";
  }

  return (
    <header data-slot="app-header" className="h-14 px-6 flex items-center">
      <span className="font-roboto text-base leading-6 tracking-cv capitalize text-cv-muted dark:text-zinc-400">
        {headerTitle}
      </span>
    </header>
  );
}
