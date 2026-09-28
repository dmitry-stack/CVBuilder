"use client";

import { Plus } from "lucide-react";
import { TrashXIcon } from "@/components/ui/icons";

interface CVSkillsActionsProps {
  isDeleteMode: boolean;
  selectedCount: number;
  isDeleting?: boolean;
  onAddClick: () => void;
  onEnterDeleteMode: () => void;
  onCancelDeleteMode: () => void;
  onConfirmDeleteClick: () => void;
}

export function CVSkillsActions({
  isDeleteMode,
  selectedCount,
  isDeleting,
  onAddClick,
  onEnterDeleteMode,
  onCancelDeleteMode,
  onConfirmDeleteClick,
}: CVSkillsActionsProps) {
  return (
    <div
      data-slot="skills-actions"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-12 pt-4 items-center"
    >
      <div className="hidden lg:block" aria-hidden="true" />
      {!isDeleteMode ? (
        <>
          <div className="flex items-center">
            <button
              type="button"
              onClick={onAddClick}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer select-none"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={onEnterDeleteMode}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-cv-accent dark:text-[#E04B4C] hover:opacity-80 transition-opacity cursor-pointer select-none"
            >
              <TrashXIcon className="h-4 w-4" />
              <span>Remove Skills</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <button
              type="button"
              onClick={onCancelDeleteMode}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer select-none"
            >
              <span>Cancel</span>
            </button>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={onConfirmDeleteClick}
              disabled={selectedCount === 0 || isDeleting}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-cv-accent dark:text-[#E04B4C] hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer select-none"
            >
              <TrashXIcon className="h-4 w-4" />
              <span>
                {selectedCount > 0 ? `Delete (${selectedCount})` : "Delete"}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
