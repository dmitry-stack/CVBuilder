"use client";

import { usePathname } from "next/navigation";
import { ActionTabs } from "@/components/ui/ActionTabs";

interface CVTabsProps {
  cvId?: string;
  userId?: string;
}

export function CVTabs({ cvId, userId }: CVTabsProps) {
  const pathname = usePathname();
  const id = cvId || userId || "";

  const tabs = [
    {
      label: "DETAILS",
      href: `/cvs/${id}/details`,
      isActive: pathname === `/cvs/${id}/details` || pathname === `/cvs/${id}`,
    },
    {
      label: "SKILLS",
      href: `/cvs/${id}/skills`,
      isActive: pathname === `/cvs/${id}/skills`,
    },
    {
      label: "PROJECTS",
      href: `/cvs/${id}/projects`,
      isActive: pathname === `/cvs/${id}/projects`,
    },
    {
      label: "PREVIEW",
      href: `/cvs/${id}/preview`,
      isActive: pathname === `/cvs/${id}/preview`,
    },
  ];

  return <ActionTabs tabs={tabs} />;
}
