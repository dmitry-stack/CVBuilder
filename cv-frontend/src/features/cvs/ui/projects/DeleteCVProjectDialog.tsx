"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/i18n";

interface DeleteCVProjectDialogProps {
  isOpen: boolean;
  projectName?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCVProjectDialog({
  isOpen,
  projectName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCVProjectDialogProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-roboto"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2
            id="delete-project-title"
            className="text-lg font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
          >
            {t("projects.removeTitle")}
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

        <div className="px-6 py-4 space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 font-roboto leading-relaxed">
            {t("projects.removeConfirm", {
              name: projectName || t("projects.thisProject"),
            })}
          </p>
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
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? t("common.removing") : t("common.remove")}
          </Button>
        </div>
      </div>
    </div>
  );
}
