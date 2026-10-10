"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, TrendingUp, Languages, FileUser } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useTranslation, type TranslationKey } from "@/i18n";

interface NavItem {
  key: TranslationKey;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
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

interface NavLinksProps {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

export function NavLinks({ isCollapsed = false, onItemClick }: NavLinksProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav aria-label="Main Navigation" className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        const label = t(item.key);

        if (isCollapsed) {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              title={label}
              aria-label={label}
              className={cn(
                "group flex h-12 w-12 mx-auto my-1 items-center justify-center rounded-full text-base transition-colors",
                isActive
                  ? "bg-cv-surface dark:bg-[#383838] text-cv-text dark:text-[#F5F5F7]"
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
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
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
            <span className="font-roboto">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
