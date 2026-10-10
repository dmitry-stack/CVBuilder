"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import logo from "@/shared/assets/logo.svg";
import { useTranslation } from "@/i18n";
import { NavLinks } from "./NavLinks";
import { NavUserProfile } from "./NavUserProfile";
import { NavMobileHeader } from "./NavMobileHeader";
import { useSidebarContext } from "./SidebarContext";

interface NavbarProps {
  userName?: string;
  userInitial?: string;
  userAvatar?: string | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isLoading?: boolean;
}

export function Navbar({
  userName,
  userInitial,
  userAvatar,
  isCollapsed: propIsCollapsed,
  onToggleCollapse: propOnToggleCollapse,
  isLoading,
}: NavbarProps = {}) {
  const sidebarContext = useSidebarContext();
  const isCollapsed =
    propIsCollapsed !== undefined
      ? propIsCollapsed
      : (sidebarContext?.isCollapsed ?? false);

  const toggleCollapse =
    propOnToggleCollapse || sidebarContext?.toggleCollapse || (() => {});
  const { t } = useTranslation();

  const renderDesktopHeader = () => {
    if (isCollapsed) {
      return (
        <div className="flex h-14 items-center justify-center">
          <Link
            href="/users"
            title={t("nav.brand")}
            aria-label={t("nav.brand")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-[#383838] transition-colors"
          >
            <Image
              src={logo}
              alt="CV Builder Logo"
              width={24}
              height={24}
              priority
              unoptimized
              className="h-6 w-6 shrink-0"
            />
          </Link>
        </div>
      );
    }

    return (
      <div className="flex h-14 items-center justify-between pl-4 pr-2">
        <Link
          href="/users"
          className="flex items-center gap-4 hover:opacity-85 transition-opacity"
        >
          <Image
            src={logo}
            alt="CV Builder Logo"
            width={24}
            height={24}
            priority
            unoptimized
            className="h-6 w-6 shrink-0"
          />
          <span className="font-roboto text-base font-medium leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7] whitespace-nowrap">
            {t("nav.brand")}
          </span>
        </Link>
      </div>
    );
  };

  return (
    <>
      <NavMobileHeader
        userName={userName}
        userInitial={userInitial}
        userAvatar={userAvatar}
        isLoading={isLoading}
      />

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 hidden bg-white dark:bg-[#2E2E2E] md:flex md:flex-col",
          isCollapsed ? "w-16" : "w-50",
        )}
        aria-label="Sidebar Navigation"
        data-collapsed={isCollapsed}
      >
        <button
          type="button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-4 z-50 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-[#2E2E2E] text-cv-text dark:text-[#F5F5F7] hover:bg-zinc-100 dark:hover:bg-[#383838] transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        <div className="flex h-full flex-col justify-between overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col">
            {renderDesktopHeader()}
            <div className={cn("mt-2", isCollapsed ? "px-1" : "")}>
              <NavLinks isCollapsed={isCollapsed} />
            </div>
          </div>
          <div className="pb-3">
            <NavUserProfile
              isCollapsed={isCollapsed}
              userName={userName}
              userInitial={userInitial}
              userAvatar={userAvatar}
              isLoading={isLoading}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

export { Navbar as Sidebar };
