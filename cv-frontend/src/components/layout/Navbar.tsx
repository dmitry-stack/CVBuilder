"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Users,
  TrendingUp,
  Languages,
  FileUser,
  Menu,
  X,
  Settings,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useApolloClient } from "@apollo/client/react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTranslation, type TranslationKey } from "@/i18n";

interface NavItem {
  key: TranslationKey;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "nav.employees",
    href: "/users",
    icon: Users,
  },
  {
    key: "nav.skills",
    href: "/skills",
    icon: TrendingUp,
  },
  {
    key: "nav.languages",
    href: "/languages",
    icon: Languages,
  },
  {
    key: "nav.cvs",
    href: "/cvs",
    icon: FileUser,
  },
];

interface NavbarProps {
  userName?: string;
  userInitial?: string;
}

export function Navbar({
  userName: userNameProp,
  userInitial: userInitialProp,
}: NavbarProps = {}) {
  const { currentUser, currentUserId } = useCurrentUser();

  const fetchedFullName = [currentUser?.first_name, currentUser?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const resolvedName =
    userNameProp || fetchedFullName || currentUser?.email || "User";

  const initial =
    userInitialProp ||
    (resolvedName && resolvedName !== "User"
      ? resolvedName.charAt(0).toUpperCase()
      : currentUser?.email
        ? currentUser.email.charAt(0).toUpperCase()
        : "U");

  const profileHref = currentUserId
    ? `/users/${currentUserId}/profile`
    : "/users";

  const pathname = usePathname();
  const router = useRouter();
  const client = useApolloClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutAction();
      await client.clearStore();
      router.push("/signin");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderNavLinks = () => (
    <nav aria-label="Main Navigation" className="flex flex-col">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        // ||
        // (item.href !== "/" && pathname?.startsWith(`${item.href}/`));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group flex h-14 w-full items-center gap-4 pl-4 rounded-r-full text-base leading-6 tracking-[0.15px] transition-colors",
              isActive
                ? "bg-cv-surface dark:bg-[#383838] text-cv-text dark:text-[#F5F5F7] font-normal"
                : "text-cv-muted dark:text-[#AEAEAE] hover:bg-zinc-100 dark:hover:bg-[#383838] hover:text-cv-text dark:hover:text-[#F5F5F7]",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              className={cn(
                "h-6 w-6 shrink-0 transition-colors",
                isActive
                  ? "text-cv-text dark:text-[#F5F5F7]"
                  : "text-cv-muted dark:text-[#AEAEAE] group-hover:text-cv-text dark:group-hover:text-[#F5F5F7]",
              )}
            />
            <span className="font-roboto">{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );

  const renderUserProfile = () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="group flex h-14 w-full items-center gap-2 pl-2 pr-3 rounded-r-full text-left transition-colors hover:bg-zinc-100 dark:hover:bg-[#383838] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label={`User profile for ${resolvedName}`}
          >
            <div
              className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cv-accent text-cv-on-accent"
              aria-hidden="true"
            >
              {currentUser?.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={resolvedName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="font-roboto text-xl font-medium leading-5 uppercase">
                  {initial}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span
                className="block truncate font-roboto text-base leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7]"
                title={resolvedName}
              >
                {resolvedName}
              </span>
            </div>
          </button>
        }
      />
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        alignOffset={0}
        collisionPadding={0}
        className="w-50 h-[121px] rounded-lg border border-cv-border dark:border-[#AEAEAE] bg-[#E2E2E4] dark:bg-[#2E2E2E] p-0 shadow-lg font-roboto overflow-hidden"
      >
        <DropdownMenuGroup className="flex flex-col h-full justify-between">
          <DropdownMenuItem
            className="group/dropdown-menu-item flex h-10 w-full items-center gap-4 pl-4  text-base leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7] hover:bg-zinc-100 dark:hover:bg-[#383838] focus:bg-zinc-100 dark:focus:bg-[#383838] cursor-pointer outline-hidden transition-colors"
            render={
              <Link href={profileHref} onClick={() => setMobileOpen(false)} />
            }
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center">
              <UserIcon className="h-4 w-4 text-cv-text dark:text-[#F5F5F7]" />
            </div>
            <span className="font-roboto font-normal text-base leading-6 tracking-cv">
              {t("nav.profile")}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="group/dropdown-menu-item flex h-10 w-full items-center gap-4 pl-4  text-base leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7] hover:bg-zinc-100 dark:hover:bg-[#383838] focus:bg-zinc-100 dark:focus:bg-[#383838] cursor-pointer outline-hidden transition-colors"
            render={
              <Link href="/settings" onClick={() => setMobileOpen(false)} />
            }
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center">
              <Settings className="h-4 w-4 text-cv-text dark:text-[#F5F5F7]" />
            </div>
            <span className="font-roboto font-normal text-base leading-6 tracking-cv">
              {t("nav.settings")}
            </span>
          </DropdownMenuItem>

          <div className="h-px w-full bg-cv-border dark:bg-[#AEAEAE]/30 shrink-0" />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group/dropdown-menu-item flex h-10 w-full items-center gap-4 pl-4  text-base leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7] hover:bg-zinc-100 dark:hover:bg-[#383838] focus:bg-zinc-100 dark:focus:bg-[#383838] cursor-pointer outline-hidden transition-colors"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center">
              <LogOut className="h-4 w-4 text-cv-text dark:text-[#F5F5F7]" />
            </div>
            <span className="font-roboto font-normal text-base leading-6 tracking-cv">
              {isLoggingOut ? t("nav.loggingOut") : t("nav.logout")}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderAsideContent = () => (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      <div className="flex flex-col">
        <Link
          href="/users"
          onClick={() => setMobileOpen(false)}
          className="flex h-14 w-full items-center gap-4 pl-4 rounded-r-full hover:bg-zinc-100 dark:hover:bg-[#383838] transition-colors group"
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

        <div className="mt-3">{renderNavLinks()}</div>
      </div>

      <div className="pb-3">{renderUserProfile()}</div>
    </div>
  );

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
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="relative h-full w-50 border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-[#2E2E2E]"
            onClick={(e) => e.stopPropagation()}
          >
            {renderAsideContent()}
          </aside>
        </div>
      )}

      <aside
        className="fixed top-0 bottom-0 left-0 z-40 hidden w-50 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#2E2E2E] md:flex md:flex-col"
        aria-label="Sidebar Navigation"
      >
        {renderAsideContent()}
      </aside>
    </>
  );
}

export { Navbar as Sidebar };
