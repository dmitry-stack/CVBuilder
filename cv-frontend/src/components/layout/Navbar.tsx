"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Languages,
  FileUser,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { useApolloClient } from "@apollo/client/react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Employees",
    href: "/users",
    icon: Users,
  },
  {
    label: "Skills",
    href: "/skills",
    icon: TrendingUp,
  },
  {
    label: "Languages",
    href: "/languages",
    icon: Languages,
  },
  {
    label: "CVs",
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

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
      setProfileMenuOpen(false);
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
                ? "bg-cv-surface dark:bg-zinc-800 text-cv-text dark:text-zinc-100 font-normal"
                : "text-cv-muted dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-cv-text dark:hover:text-zinc-200",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              className={cn(
                "h-6 w-6 shrink-0 transition-colors",
                isActive
                  ? "text-cv-text dark:text-zinc-100"
                  : "text-cv-muted dark:text-zinc-400 group-hover:text-cv-text dark:group-hover:text-zinc-200",
              )}
            />
            <span className="font-roboto">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const renderUserProfile = () => (
    <div className="relative" ref={profileMenuRef}>
      {profileMenuOpen && (
        <div
          role="menu"
          aria-label="User Menu"
          className="absolute bottom-16 left-2 right-2 z-50 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
            <p className="font-roboto text-sm font-medium text-cv-text dark:text-zinc-100 truncate">
              {resolvedName}
            </p>
            {currentUser?.email && (
              <p className="font-roboto text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {currentUser.email}
              </p>
            )}
          </div>
          <Link
            href={profileHref}
            onClick={() => {
              setProfileMenuOpen(false);
              setMobileOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        className="group flex h-14 w-full items-center gap-2 pl-2 pr-3 rounded-r-full text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-850 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        aria-expanded={profileMenuOpen}
        aria-haspopup="true"
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
            className="block truncate font-roboto text-base leading-6 tracking-cv text-cv-text dark:text-zinc-100"
            title={resolvedName}
          >
            {resolvedName}
          </span>
        </div>
      </button>
    </div>
  );

  const renderAsideContent = () => (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      <div className="flex flex-col">
        <Link
          href="/users"
          onClick={() => setMobileOpen(false)}
          className="flex h-14 w-full items-center gap-4 pl-4 rounded-r-full hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors group"
        >
          <Image
            src={logo}
            alt="CV Builder Logo"
            width={24}
            height={24}
            priority
            className="h-6 w-6 shrink-0"
          />
          <span className="font-roboto text-base font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
            CV Builder
          </span>
        </Link>

        <div className="mt-3">{renderNavLinks()}</div>
      </div>

      <div className="pb-3">{renderUserProfile()}</div>
    </div>
  );

  return (
    <>
      <header className="flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
        <Link href="/users" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="CV Builder Logo"
            width={24}
            height={24}
            priority
            className="h-6 w-6 shrink-0"
          />
          <span className="font-roboto text-base font-medium text-cv-text dark:text-zinc-100">
            CV Builder
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded p-2 text-cv-text hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
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
            className="relative h-full w-50 border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
            onClick={(e) => e.stopPropagation()}
          >
            {renderAsideContent()}
          </aside>
        </div>
      )}

      <aside
        className="fixed top-0 bottom-0 left-0 z-40 hidden w-50 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:flex md:flex-col"
        aria-label="Sidebar Navigation"
      >
        {renderAsideContent()}
      </aside>
    </>
  );
}

export { Navbar as Sidebar };
