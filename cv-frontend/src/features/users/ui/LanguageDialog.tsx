"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageProficiencyBar } from "./LanguageProficiencyBar";
import {
  languageFormSchema,
  proficiencyLevels,
  type LanguageFormData,
  type ProficiencyType,
} from "../schemas/language.schema";

interface CatalogLanguageOption {
  name: string;
  native_name?: string | null;
}

interface LanguageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LanguageFormData) => Promise<void>;
  onDelete?: (languageName: string) => Promise<void>;
  initialData?: LanguageFormData | null;
  catalogLanguages?: CatalogLanguageOption[];
}

const PROFICIENCY_LABELS: Record<ProficiencyType, string> = {
  A1: "A1 - Beginner",
  A2: "A2 - Elementary",
  B1: "B1 - Intermediate",
  B2: "B2 - Upper Intermediate",
  C1: "C1 - Advanced",
  C2: "C2 - Proficient / Mastery",
  Native: "Native - Native / Bilingual",
};

export function LanguageDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  catalogLanguages = [],
}: LanguageDialogProps) {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
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

  const handleDelete = async () => {
    if (!initialData?.name || !onDelete) return;
    if (
      window.confirm(`Are you sure you want to remove "${initialData.name}"?`)
    ) {
      await onDelete(initialData.name);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2
            id="language-dialog-title"
            className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
          >
            {isEdit ? "Edit Language" : "Add Language"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-sm focus:outline-hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="language_name"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Language Name
            </label>
            <input
              id="language_name"
              type="text"
              placeholder="e.g. English, German, Spanish"
              disabled={isEdit || isSubmitting}
              list="catalog-languages-list"
              {...register("name")}
              aria-invalid={!!errors.name}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            />
            <datalist id="catalog-languages-list">
              {catalogLanguages.map((l) => (
                <option
                  key={l.name}
                  value={l.name}
                  label={
                    l.native_name ? `${l.name} (${l.native_name})` : l.name
                  }
                />
              ))}
            </datalist>
            {errors.name && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="language_proficiency"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Proficiency Level
            </label>
            <div className="space-y-2">
              <select
                id="language_proficiency"
                disabled={isSubmitting}
                {...register("proficiency")}
                className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto appearance-none focus:outline-hidden focus:ring-1 focus:ring-cv-accent cursor-pointer transition-colors"
              >
                {proficiencyLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {PROFICIENCY_LABELS[lvl]}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xs bg-zinc-100 dark:bg-zinc-800/50">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto">
                  Preview:
                </span>
                <LanguageProficiencyBar
                  proficiency={selectedProficiency || "A1"}
                  languageName={currentLanguageName || "Language"}
                />
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  {PROFICIENCY_LABELS[selectedProficiency] ||
                    selectedProficiency}
                </span>
              </div>
            </div>
            {errors.proficiency && (
              <p className="mt-1 text-xs text-destructive">
                {errors.proficiency.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {isEdit && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                aria-label="Delete language"
                className="inline-flex items-center gap-1.5 text-xs text-destructive hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
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
                className="rounded-full px-4 h-9 text-xs font-medium cursor-pointer"
              >
                Cancel
              </Button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white px-6 h-9 text-xs font-medium uppercase tracking-wider shadow-cv-button transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Save Changes"
                    : "Add Language"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
