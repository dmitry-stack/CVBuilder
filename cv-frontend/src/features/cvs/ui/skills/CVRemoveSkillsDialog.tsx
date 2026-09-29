"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2
              id="remove-skills-dialog-title"
              className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
            >
              Remove skills
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 focus:outline-hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p
            id="remove-skills-dialog-description"
            className="text-sm text-zinc-600 dark:text-zinc-300 font-roboto leading-relaxed"
          >
            Are you sure you want to remove {count} skills?
          </p>
          {skillNames.length > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto">
              ({skillNames.join(", ")})
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full px-4 h-9 text-xs font-medium uppercase tracking-wider cursor-pointer"
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-full bg-destructive hover:bg-destructive/90 text-white px-5 h-9 text-xs font-medium uppercase tracking-wider shadow-cv-button transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
          >
            {isDeleting ? "Removing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
