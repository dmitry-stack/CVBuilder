"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteSkillDialog } from "./DeleteSkillDialog";
import {
  SkillDialogFormFields,
  type CategoryOption,
} from "./SkillDialogFormFields";
import { useSkillDialogForm } from "../hooks/useSkillDialogForm";
import { useTranslation } from "@/i18n";
import type { SkillFormData, MasteryType } from "../schemas/skill.schema";

export type { CategoryOption };

interface SkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SkillFormData) => Promise<void>;
  onDelete?: (skillName: string) => Promise<void>;
  initialData?: SkillFormData | null;
  categories: CategoryOption[];
  catalogSkills?: Array<{ name: string; categoryId?: string | null }>;
}

export function SkillDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  categories,
  catalogSkills = [],
}: SkillDialogProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(initialData);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    selectedMastery,
    selectedCategoryId,
    currentSkillName,
    handleSkillNameChange,
  } = useSkillDialogForm({
    isOpen,
    initialData,
    categories,
    catalogSkills,
  });

  if (!isOpen) return null;

  const onSubmit = async (data: SkillFormData) => {
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
      aria-labelledby="skill-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-visible animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2
            id="skill-dialog-title"
            className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
          >
            {isEdit ? t("skills.editSkill") : t("skills.addSkill")}
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
          <SkillDialogFormFields
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            isEdit={isEdit}
            categories={categories}
            catalogSkills={catalogSkills}
            selectedCategoryId={selectedCategoryId || ""}
            onCategoryChange={(val) =>
              setValue("categoryId", val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            selectedMastery={selectedMastery}
            onMasteryChange={(val) =>
              setValue("mastery", val as MasteryType, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            currentSkillName={currentSkillName}
            onSkillNameChange={handleSkillNameChange}
          />

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {isEdit && onDelete ? (
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(true)}
                disabled={isSubmitting}
                aria-label="Delete skill"
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
                    : t("skills.addSkill")}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <DeleteSkillDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        skillNames={initialData?.name ? [initialData.name] : []}
      />
    </div>
  );
}
