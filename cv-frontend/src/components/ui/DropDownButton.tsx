"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n";

export interface DropdownMenuButtonProps {
  id?: string;
  userId?: string;
  viewHref?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function DropdownMenuButton({
  id,
  userId,
  viewHref,
  onUpdate,
  onDelete,
}: DropdownMenuButtonProps) {
  const { t } = useTranslation();
  const targetId = id || userId || "";
  const targetHref = viewHref || `/users/${targetId}/profile`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-transparent text-[#2E2E2E] dark:text-[#F5F5F7] hover:border-[#2E2E2E] dark:hover:border-[#8E8E93] active:bg-[#9E9E9E] active:border-[#9E9E9E] active:text-white dark:active:bg-[#F5F5F7] dark:active:border-[#F5F5F7] dark:active:text-[#1E1E1E] aria-expanded:bg-[#9E9E9E] aria-expanded:border-[#9E9E9E] aria-expanded:text-white dark:aria-expanded:bg-[#F5F5F7] dark:aria-expanded:border-[#F5F5F7] dark:aria-expanded:text-[#1E1E1E] transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C63031] dark:focus-visible:ring-[#C63031] cursor-pointer"
            title="User actions"
            aria-label={`Actions for user ${targetId}`}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href={targetHref} />}>
            {t("common.view")}
          </DropdownMenuItem>
          {onUpdate ? (
            <DropdownMenuItem onClick={onUpdate}>
              {t("common.update")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>{t("common.update")}</DropdownMenuItem>
          )}
          {onDelete ? (
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              {t("common.delete")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem variant="destructive">
              {t("common.delete")}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
