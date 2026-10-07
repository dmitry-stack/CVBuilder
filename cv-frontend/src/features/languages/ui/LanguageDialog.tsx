"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  languageFormSchema,
  type LanguageFormData,
  type ProficiencyType,
} from "../schemas/language.schema";
import { DeleteLanguageDialog } from "./DeleteLanguageDialog";
import {
  LanguageDialogFormFields,
  type CatalogLanguageOption,
} from "./LanguageDialogFormFields";
import { useTranslation } from "@/i18n";

export type { CatalogLanguageOption };

interface LanguageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LanguageFormData) => Promise<void>;
  onDelete?: (languageName: string) => Promise<void>;
  initialData?: LanguageFormData | null;
  catalogLanguages?: CatalogLanguageOption[];
}

export function LanguageDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  catalogLanguages = [],
}: LanguageDialogProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(initialData);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      proficiency: initialData?.proficiency || "A1",
    },
  });

  const selectedProficiency = useWatch({
    control,
    name: "proficiency",
    defaultValue: initialData?.proficiency || "A1",
  }) as ProficiencyType;

  const currentLanguageName = useWatch({
    control,
    name: "name",
    defaultValue: initialData?.name || "",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || "",
        proficiency: initialData?.proficiency || "A1",
      });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: LanguageFormData) => {
    await onSave(data);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!initialData?.name || !onDelete) return;
    await onDelete(initialData.name);
    setIsConfirmDeleteOpen(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-visible animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2
            id="language-dialog-title"
            className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
          >
            {isEdit ? t("languages.editLanguage") : t("languages.addLanguage")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 focus:outline-hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <LanguageDialogFormFields
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            isEdit={isEdit}
            catalogLanguages={catalogLanguages}
            selectedProficiency={selectedProficiency}
            currentLanguageName={currentLanguageName}
            onProficiencyChange={(val) =>
              setValue("proficiency", val as ProficiencyType, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {isEdit && onDelete ? (
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(true)}
                disabled={isSubmitting}
                aria-label="Delete language"
                className="inline-flex items-center gap-1.5 text-xs text-destructive hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t("common.delete")}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-cv-button"
              >
                {isSubmitting
                  ? t("common.saving")
                  : isEdit
                    ? t("common.saveChanges")
                    : t("languages.addLanguage")}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <DeleteLanguageDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        languageNames={initialData?.name ? [initialData.name] : []}
      />
    </div>
  );
}
