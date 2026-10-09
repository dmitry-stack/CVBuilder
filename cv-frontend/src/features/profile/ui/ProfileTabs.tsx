"use client";

import { usePathname } from "next/navigation";
import { ActionTabs } from "@/shared/components/ui/ActionTabs";
import { HeaderSync } from "@/shared/components/layout/HeaderContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useTranslation } from "@/i18n";

interface ProfileTabsProps {
  userId: string;
  isOwner?: boolean;
}

export function ProfileTabs({ userId, isOwner: propIsOwner }: ProfileTabsProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { currentUser, isOwnProfile } = useCurrentUser();

  const isOwner =
    typeof propIsOwner === "boolean" ? propIsOwner : isOwnProfile(userId);

  const ownerName =
    currentUser
      ? `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim() ||
        currentUser.email ||
        ""
      : "";

  const tabs = [
    {
      label: t("profile.title"),
      href: `/users/${userId}/profile`,
      isActive:
        pathname === `/users/${userId}/profile` ||
        pathname === `/users/${userId}`,
    },
    {
      label: t("skills.title"),
      href: `/users/${userId}/skills`,
      isActive: pathname === `/users/${userId}/skills`,
    },
    {
      label: t("languages.title"),
      href: `/users/${userId}/languages`,
      isActive: pathname === `/users/${userId}/languages`,
    },
    ...(isOwner
      ? [
          {
            label: t("nav.cvs"),
            href: `/users/${userId}/cvs`,
            isActive: pathname === `/users/${userId}/cvs`,
          },
        ]
      : []),
  ];

  return (
    <>
      {isOwner && currentUser && (
        <HeaderSync userName={ownerName} entityId={userId} />
      )}
      <ActionTabs tabs={tabs} />
    </>
  );
}
