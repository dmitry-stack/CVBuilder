"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

export interface DeleteLanguageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  languageNames: string[];
  isDeleting?: boolean;
}

export function DeleteLanguageDialog({
  isOpen,
  onClose,
  onConfirm,
  languageNames,
  isDeleting: propIsDeleting = false,
}: DeleteLanguageDialogProps) {
  const { t } = useTranslation();
  const [internalDeleting, setInternalDeleting] = useState(false);
  const isDeleting = propIsDeleting || internalDeleting;

  if (!isOpen) return null;

  const isSingle = languageNames.length === 1;
  const title = isSingle
    ? t("languages.deleteLanguage")
    : t("languages.deleteLanguages");

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
      aria-labelledby="delete-language-dialog-title"
      aria-describedby="delete-language-dialog-description"
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
            id="delete-language-dialog-title"
            className="text-lg font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
          >
            {title}
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
          <p
            id="delete-language-dialog-description"
            className="text-sm text-zinc-600 dark:text-zinc-300 font-roboto leading-relaxed"
          >
            {isSingle ? (
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {t("languages.deleteConfirmText", {
                  name: `“${languageNames[0]}”`,
                })}
              </span>
            ) : (
              <>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("languages.deleteCountConfirmText", {
                    count: languageNames.length,
                  })}
                </span>
                {languageNames.length > 0 && (
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {" "}
                    ({languageNames.join(", ")})
                  </span>
                )}
              </>
            )}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto">
            {t("languages.deleteWarning", {
              item: isSingle
                ? t("languages.language")
                : t("languages.languages"),
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
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? t("common.deleting")
              : isSingle
                ? t("languages.deleteLanguage")
                : t("languages.deleteLanguageCount", {
                    count: languageNames.length,
                  })}
          </Button>
        </div>
      </div>
    </div>
  );
}
