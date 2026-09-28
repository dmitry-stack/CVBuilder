"use client";

import { usePathname } from "next/navigation";
import { ActionTabs } from "@/components/ui/ActionTabs";

interface ProfileTabsProps {
  userId: string;
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "PROFILE",
      href: `/users/${userId}/profile`,
      isActive:
        pathname === `/users/${userId}/profile` ||
        pathname === `/users/${userId}`,
    },
    {
      label: "SKILLS",
      href: `/users/${userId}/skills`,
      isActive: pathname === `/users/${userId}/skills`,
    },
    {
      label: "LANGUAGES",
      href: `/users/${userId}/languages`,
      isActive: pathname === `/users/${userId}/languages`,
    },
  ];

  return <ActionTabs tabs={tabs} />;
}
