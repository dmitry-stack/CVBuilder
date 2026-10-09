"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/i18n";

export interface CVRemoveSkillsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  skillNames: string[];
  isDeleting?: boolean;
}

export function CVRemoveSkillsDialog({
  isOpen,
  onClose,
  onConfirm,
  skillNames,
  isDeleting: propIsDeleting = false,
}: CVRemoveSkillsDialogProps) {
  const { t } = useTranslation();
  const [internalDeleting, setInternalDeleting] = useState(false);
  const isDeleting = propIsDeleting || internalDeleting;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const count = skillNames.length;

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
      aria-labelledby="remove-skills-dialog-title"
      aria-describedby="remove-skills-dialog-description"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isDeleting) {
          e.stopPropagation();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2
            id="remove-skills-dialog-title"
            className="text-lg font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
          >
            {t("cvSkills.removeSkillsTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1 focus:outline-hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-1">
          <p
            id="remove-skills-dialog-description"
            className="text-sm text-zinc-600 dark:text-zinc-300 font-roboto leading-relaxed"
          >
            {t("cvSkills.removeConfirmCount", { count })}
          </p>
          {skillNames.length > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto">
              ({skillNames.join(", ")})
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onClose}
            disabled={isDeleting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? t("common.removing") : t("common.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
