"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, User } from "lucide-react";
import { useHeaderContext } from "./HeaderContext";
import { useTranslation } from "@/i18n";

export function Header() {
  const pathname = usePathname() || "";
  const { userName, entityId } = useHeaderContext();
  const { t } = useTranslation();

  const userMatch = pathname.match(/^\/users\/([^/]+)(?:\/([^/]+))?$/);

  if (userMatch) {
    const [, userId, subRoute] = userMatch;
    if (userId && userId !== "loading") {
      let subPageTitle = t("header.profile");
      if (subRoute === "skills") subPageTitle = t("header.skills");
      else if (subRoute === "languages") subPageTitle = t("header.languages");
      else if (subRoute === "cvs") subPageTitle = t("header.cvs");

      const isCurrentEntity = !entityId || entityId === userId;
      const currentUserName = isCurrentEntity ? userName : null;
      let displayName: string | null = null;
      if (currentUserName !== null) {
        displayName = currentUserName.trim() || t("cvs.unknownEmployee");
      }

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
              {t("header.employees")}
            </Link>

            <ChevronRight
              className="h-4 w-4 text-zinc-400 dark:text-zinc-600 shrink-0"
              aria-hidden="true"
            />

            <span className="inline-flex items-center gap-1.5 font-medium text-cv-accent">
              <User className="h-4 w-4 shrink-0" aria-hidden="true" />
              {displayName ? (
                <span className="truncate">{displayName}</span>
              ) : (
                <span
                  data-slot="header-user-skeleton"
                  className="h-4 w-28 rounded-xs bg-zinc-200 dark:bg-zinc-700 animate-pulse inline-block align-middle"
                  aria-label="Loading user name"
                />
              )}
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

  const cvMatch = pathname.match(/^\/cvs\/([^/]+)(?:\/([^/]+))?$/);

  if (cvMatch) {
    const [, cvId, subRoute] = cvMatch;
    if (cvId && cvId !== "loading") {
      let subPageTitle = t("header.details");
      if (subRoute === "skills") subPageTitle = t("header.skills");
      else if (subRoute === "projects") subPageTitle = t("header.projects");
      else if (subRoute === "preview") subPageTitle = t("header.preview");

      const isCurrentEntity = !entityId || entityId === cvId;
      const currentCvName = isCurrentEntity ? userName : null;
      let displayCvName: string | null = null;
      if (currentCvName !== null) {
        displayCvName = currentCvName.trim() || t("header.details");
      }

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
              href="/cvs"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {t("header.cvs")}
            </Link>

            <ChevronRight
              className="h-4 w-4 text-zinc-400 dark:text-zinc-600 shrink-0"
              aria-hidden="true"
            />

            <span className="font-medium text-cv-accent truncate max-w-xs sm:max-w-md">
              {displayCvName ? (
                displayCvName
              ) : (
                <span
                  data-slot="header-cv-skeleton"
                  className="h-4 w-32 rounded-xs bg-zinc-200 dark:bg-zinc-700 animate-pulse inline-block align-middle"
                  aria-label="Loading CV name"
                />
              )}
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

  let headerTitle = t("header.employees");
  if (pathname.startsWith("/skills")) {
    headerTitle = t("header.skills");
  } else if (pathname.startsWith("/languages")) {
    headerTitle = t("header.languages");
  } else if (pathname.startsWith("/cvs")) {
    headerTitle = t("header.cvs");
  } else if (pathname.startsWith("/settings")) {
    headerTitle = t("header.settings");
  }

  return (
    <header data-slot="app-header" className="h-14 px-6 flex items-center">
      <span className="font-roboto text-base leading-6 tracking-cv capitalize text-cv-muted dark:text-[#AEAEAE]">
        {headerTitle}
      </span>
    </header>
  );
}
