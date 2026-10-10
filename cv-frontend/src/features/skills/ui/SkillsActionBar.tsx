"use client";

import { Plus } from "lucide-react";
import { TrashXIcon } from "@/shared/components/ui/icons";
import { useTranslation } from "@/i18n";

export interface SkillsActionBarProps {
  isOwner?: boolean;
  isDeleteMode: boolean;
  hasSkills: boolean;
  selectedCount: number;
  isDeleting: boolean;
  onOpenAdd: () => void;
  onEnterDeleteMode: () => void;
  onCancelDeleteMode: () => void;
  onRequestDeleteConfirm: () => void;
}

export function SkillsActionBar({
  isOwner,
  isDeleteMode,
  hasSkills,
  selectedCount,
  isDeleting,
  onOpenAdd,
  onEnterDeleteMode,
  onCancelDeleteMode,
  onRequestDeleteConfirm,
}: SkillsActionBarProps) {
  const { t } = useTranslation();

  if (!isOwner) return null;

  return (
    <div
      data-slot="skills-actions"
      className="flex items-center justify-end gap-10 mt-12 pt-4"
    >
      {!isDeleteMode ? (
        <>
          <button
            type="button"
            onClick={onOpenAdd}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer select-none"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{t("skills.addSkill")}</span>
          </button>

          {hasSkills && (
            <button
              type="button"
              onClick={onEnterDeleteMode}
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#C63031] dark:text-[#E04B4C] hover:opacity-80 transition-opacity cursor-pointer select-none"
            >
              <TrashXIcon className="h-4 w-4" />
              <span>{t("skills.removeSkills")}</span>
            </button>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onCancelDeleteMode}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer select-none"
          >
            <span>{t("common.cancel")}</span>
          </button>

          <button
            type="button"
            onClick={onRequestDeleteConfirm}
            disabled={selectedCount === 0 || isDeleting}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#C63031] dark:text-[#E04B4C] hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer select-none"
          >
            <TrashXIcon className="h-4 w-4" />
            <span>
              {selectedCount > 0
                ? `${t("common.delete")} (${selectedCount})`
                : t("common.delete")}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
