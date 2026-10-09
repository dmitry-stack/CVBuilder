"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/shared/assets/logo.svg";
import { useTranslation } from "@/i18n";
import { NavLinks } from "./NavLinks";
import { NavUserProfile } from "./NavUserProfile";

interface NavMobileHeaderProps {
  userName?: string;
  userInitial?: string;
  userAvatar?: string | null;
}

export function NavMobileHeader({
  userName,
  userInitial,
  userAvatar,
}: NavMobileHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  const handleClose = () => setMobileOpen(false);

  return (
    <>
      <header className="flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-[#2E2E2E] md:hidden">
        <Link href="/users" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="CV Builder Logo"
            width={24}
            height={24}
            priority
            unoptimized
            className="h-6 w-6 shrink-0"
          />
          <span className="font-roboto text-base font-medium text-cv-text dark:text-[#F5F5F7]">
            {t("nav.brand")}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded p-2 text-cv-text hover:bg-zinc-100 dark:text-[#F5F5F7] dark:hover:bg-[#383838]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={handleClose}
        >
          <aside
            className="relative h-full w-50 border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-[#2E2E2E]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col justify-between overflow-y-auto">
              <div className="flex flex-col">
                <Link
                  href="/users"
                  onClick={handleClose}
                  className="flex h-14 w-full items-center gap-4 pl-4 rounded-r-full hover:bg-zinc-100 dark:hover:bg-[#383838] transition-colors"
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
                  <span className="font-roboto text-base font-medium leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7]">
                    {t("nav.brand")}
                  </span>
                </Link>
                <div className="mt-3">
                  <NavLinks onItemClick={handleClose} />
                </div>
              </div>
              <div className="pb-3">
                <NavUserProfile
                  userName={userName}
                  userInitial={userInitial}
                  userAvatar={userAvatar}
                  onItemClick={handleClose}
                />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
