"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DeleteSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  skillNames: string[];
  isDeleting?: boolean;
}

export function DeleteSkillDialog({
  isOpen,
  onClose,
  onConfirm,
  skillNames,
  isDeleting: propIsDeleting = false,
}: DeleteSkillDialogProps) {
  const [internalDeleting, setInternalDeleting] = useState(false);
  const isDeleting = propIsDeleting || internalDeleting;

  if (!isOpen) return null;

  const isSingle = skillNames.length === 1;
  const title = isSingle ? "Delete Skill" : "Delete Skills";

  const handleConfirm = async () => {
    try {
      setInternalDeleting(true);
      await onConfirm();
      onClose();
    } finally {
      setInternalDeleting(false);
    }
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-skill-dialog-title"
      aria-describedby="delete-skill-dialog-description"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isDeleting) {
          e.stopPropagation();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2
              id="delete-skill-dialog-title"
              className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-sm focus:outline-hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p
            id="delete-skill-dialog-description"
            className="text-sm text-zinc-600 dark:text-zinc-300 font-roboto leading-relaxed"
          >
            Are you sure you want to delete{" "}
            {isSingle ? (
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                &ldquo;{skillNames[0]}&rdquo;
              </span>
            ) : (
              <>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {skillNames.length} selected skills
                </span>
                {skillNames.length > 0 && (
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    ({skillNames.join(", ")})
                  </span>
                )}
              </>
            )}
            ?
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto">
            This action cannot be undone. The selected{" "}
            {isSingle ? "skill" : "skills"} will be permanently removed from
            this profile.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full px-4 h-9 text-xs font-medium cursor-pointer"
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-full bg-destructive hover:bg-destructive/90 text-white px-5 h-9 text-xs font-medium uppercase tracking-wider shadow-cv-button transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
          >
            {isDeleting
              ? "Deleting..."
              : isSingle
                ? "Delete Skill"
                : `Delete Skills (${skillNames.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
