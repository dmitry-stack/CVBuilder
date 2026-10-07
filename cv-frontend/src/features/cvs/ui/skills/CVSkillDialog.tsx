"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  cvSkillFormSchema,
  type CvSkillFormData,
} from "../../schemas/cv-skill.schema";
import { useTranslation } from "@/i18n";

export interface CVSkillOption {
  name: string;
  categoryId?: string | null;
  mastery?: string;
}

export interface CVSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skillName: string) => Promise<void> | void;
  initialData?: { name: string } | null;
  availableSkills: CVSkillOption[];
  isSubmitting?: boolean;
}

export function CVSkillDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  availableSkills,
  isSubmitting: propIsSubmitting = false,
}: CVSkillDialogProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(initialData?.name);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = useForm<CvSkillFormData>({
    resolver: zodResolver(cvSkillFormSchema),
    defaultValues: { name: initialData?.name || "" },
  });

  const selectedName = useWatch({
    control,
    name: "name",
    defaultValue: initialData?.name || "",
  });
  const isSubmitting = propIsSubmitting || formIsSubmitting;

  useEffect(() => {
    if (isOpen) {
      reset({ name: initialData?.name || "" });
    }
  }, [isOpen, initialData, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const onSubmit = async (data: CvSkillFormData) => {
    await onSave(data.name);
    onClose();
  };

  const dialogTitle = isEdit ? t("cvSkills.updateSkill") : t("cvSkills.addSkill");

  const options =
    isEdit && initialData?.name
      ? [
          { name: initialData.name },
          ...availableSkills.filter((s) => s.name !== initialData.name),
        ]
      : availableSkills;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-skill-dialog-title"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isSubmitting) {
          e.stopPropagation();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-visible animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 id="cv-skill-dialog-title" className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto">
            {dialogTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 focus:outline-hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <Select
              id="cv-skill-select"
              label={t("cvSkills.skill")}
              alwaysShowLabel
              placeholder={t("cvSkills.selectSkill")}
              options={options.map((opt) => ({
                value: opt.name,
                label: opt.name,
              }))}
              value={selectedName}
              onChange={(val) =>
                setValue("name", val, { shouldValidate: true, shouldDirty: true })
              }
              error={errors.name?.message}
            />
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedName} className="shadow-cv-button">
              {isSubmitting ? t("common.saving") : isEdit ? t("common.save") : t("common.add")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
