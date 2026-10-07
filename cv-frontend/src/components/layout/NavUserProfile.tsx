"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User as UserIcon, Settings, LogOut } from "lucide-react";
import { useApolloClient } from "@apollo/client/react";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n";

interface NavUserProfileProps {
  isCollapsed?: boolean;
  userName?: string;
  userInitial?: string;
  userAvatar?: string | null;
  onItemClick?: () => void;
}

export function NavUserProfile({
  isCollapsed = false,
  userName: userNameProp,
  userInitial: userInitialProp,
  userAvatar: userAvatarProp,
  onItemClick,
}: NavUserProfileProps) {
  const { currentUser, currentUserId } = useCurrentUser();
  const router = useRouter();
  const client = useApolloClient();
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const effectiveAvatar =
    userAvatarProp !== undefined ? userAvatarProp : currentUser?.avatar;

  const profileHref = currentUserId
    ? `/users/${currentUserId}/profile`
    : "/users";

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

  const avatarElement = (
    <div
      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cv-accent text-cv-on-accent"
      aria-hidden="true"
    >
      {effectiveAvatar ? (
        <Image
          src={effectiveAvatar}
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
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          isCollapsed ? (
            <button
              type="button"
              className="flex h-12 w-12 mx-auto items-center justify-center rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-[#383838] focus:outline-hidden cursor-pointer"
              aria-label={`User profile for ${resolvedName}`}
              title={resolvedName}
            >
              {avatarElement}
            </button>
          ) : (
            <button
              type="button"
              className="group flex h-14 w-full items-center gap-2 pl-2 pr-3 rounded-r-full text-left transition-colors hover:bg-zinc-100 dark:hover:bg-[#383838] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              aria-label={`User profile for ${resolvedName}`}
            >
              {avatarElement}
              <div className="min-w-0 flex-1">
                <span
                  className="block truncate font-roboto text-base leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7]"
                  title={resolvedName}
                >
                  {resolvedName}
                </span>
              </div>
            </button>
          )
        }
      />
      <DropdownMenuContent
        side={isCollapsed ? "right" : "top"}
        align={isCollapsed ? "end" : "start"}
        sideOffset={isCollapsed ? 12 : 8}
        alignOffset={0}
        collisionPadding={8}
        className="w-50 h-[121px] rounded-lg border border-cv-border dark:border-[#AEAEAE] bg-[#E2E2E4] dark:bg-[#2E2E2E] p-0 shadow-lg font-roboto overflow-hidden z-50"
      >
        <DropdownMenuGroup className="flex flex-col h-full justify-between">
          <DropdownMenuItem
            className="group/dropdown-menu-item flex h-10 w-full items-center gap-4 pl-4 text-base leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7] hover:bg-zinc-100 dark:hover:bg-[#383838] focus:bg-zinc-100 dark:focus:bg-[#383838] cursor-pointer outline-hidden transition-colors"
            render={<Link href={profileHref} onClick={onItemClick} />}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center">
              <UserIcon className="h-4 w-4 text-cv-text dark:text-[#F5F5F7]" />
            </div>
            <span className="font-roboto font-normal text-base leading-6 tracking-cv">
              {t("nav.profile")}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="group/dropdown-menu-item flex h-10 w-full items-center gap-4 pl-4 text-base leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7] hover:bg-zinc-100 dark:hover:bg-[#383838] focus:bg-zinc-100 dark:focus:bg-[#383838] cursor-pointer outline-hidden transition-colors"
            render={<Link href="/settings" onClick={onItemClick} />}
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
            className="group/dropdown-menu-item flex h-10 w-full items-center gap-4 pl-4 text-base leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7] hover:bg-zinc-100 dark:hover:bg-[#383838] focus:bg-zinc-100 dark:focus:bg-[#383838] cursor-pointer outline-hidden transition-colors"
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
}
