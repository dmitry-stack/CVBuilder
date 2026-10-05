"use client";

import { usePathname } from "next/navigation";
import { ActionTabs } from "@/components/ui/ActionTabs";
import { useTranslation } from "@/i18n";

interface ProfileTabsProps {
  userId: string;
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

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
  ];

  return <ActionTabs tabs={tabs} />;
}
