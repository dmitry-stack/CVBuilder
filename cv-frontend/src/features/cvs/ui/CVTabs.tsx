"use client";

import { usePathname } from "next/navigation";
import { ActionTabs } from "@/components/ui/ActionTabs";
import { useTranslation } from "@/i18n";

interface CVTabsProps {
  cvId?: string;
  userId?: string;
}

export function CVTabs({ cvId, userId }: CVTabsProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const id = cvId || userId || "";

  const tabs = [
    {
      label: t("cvTabs.details"),
      href: `/cvs/${id}/details`,
      isActive: pathname === `/cvs/${id}/details` || pathname === `/cvs/${id}`,
    },
    {
      label: t("cvTabs.skills"),
      href: `/cvs/${id}/skills`,
      isActive: pathname === `/cvs/${id}/skills`,
    },
    {
      label: t("cvTabs.projects"),
      href: `/cvs/${id}/projects`,
      isActive: pathname === `/cvs/${id}/projects`,
    },
    {
      label: t("cvTabs.preview"),
      href: `/cvs/${id}/preview`,
      isActive: pathname === `/cvs/${id}/preview`,
    },
  ];

  return <ActionTabs tabs={tabs} />;
}
