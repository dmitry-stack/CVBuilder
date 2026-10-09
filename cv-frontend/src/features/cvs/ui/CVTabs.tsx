"use client";

import { usePathname } from "next/navigation";
import { ActionTabs } from "@/shared/components/ui/ActionTabs";
import { useTranslation } from "@/i18n";
import { useQuery } from "@apollo/client/react";
import { CvDocument } from "@/graphql/__generated__/graphql";
import { HeaderSync } from "@/shared/components/layout/HeaderContext";

interface CVTabsProps {
  cvId?: string;
  userId?: string;
}

export function CVTabs({ cvId, userId }: CVTabsProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const id = cvId || userId || "";

  const { data } = useQuery(CvDocument, {
    variables: { cvId: id },
    skip: !id,
    errorPolicy: "all",
  });
  const cvName = data?.cv?.name;

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

  return (
    <>
      {cvName && <HeaderSync userName={cvName} entityId={id} />}
      <ActionTabs tabs={tabs} />
    </>
  );
}
