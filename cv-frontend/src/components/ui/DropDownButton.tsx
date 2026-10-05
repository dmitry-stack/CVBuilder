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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-hidden cursor-pointer"
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
