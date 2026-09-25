"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillMasteryBar } from "./SkillMasteryBar";
import {
  skillFormSchema,
  masteryLevels,
  type SkillFormData,
  type MasteryType,
} from "../schemas/skill.schema";

interface CategoryOption {
  id: string;
  name: string;
}

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
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || categories[0]?.id || "",
      mastery: initialData?.mastery || "Novice",
    },
  });

  const selectedMastery = useWatch({
    control,
    name: "mastery",
    defaultValue: initialData?.mastery || "Novice",
  }) as MasteryType;

  const currentSkillName = useWatch({
    control,
    name: "name",
    defaultValue: initialData?.name || "",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || "",
        categoryId: initialData?.categoryId || categories[0]?.id || "",
        mastery: initialData?.mastery || "Novice",
      });
    }
  }, [isOpen, initialData, categories, reset]);

  const handleSkillNameChange = (name: string) => {
    setValue("name", name, { shouldValidate: true });
    const matched = catalogSkills.find(
      (s) => s.name.toLowerCase() === name.toLowerCase(),
    );
    if (matched?.categoryId) {
      setValue("categoryId", matched.categoryId, { shouldValidate: true });
    }
  };

  if (!isOpen) return null;

  const onSubmit = async (data: SkillFormData) => {
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
      aria-labelledby="skill-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2
            id="skill-dialog-title"
            className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
          >
            {isEdit ? "Edit Skill" : "Add Skill"}
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
              htmlFor="skill_name"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Skill Name
            </label>
            <input
              id="skill_name"
              type="text"
              placeholder="e.g. React, TypeScript, Docker"
              disabled={isEdit || isSubmitting}
              list="catalog-skills-list"
              {...register("name")}
              onChange={(e) => handleSkillNameChange(e.target.value)}
              aria-invalid={!!errors.name}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            />
            <datalist id="catalog-skills-list">
              {catalogSkills.map((s) => (
                <option key={s.name} value={s.name} />
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
              htmlFor="skill_category"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Category
            </label>
            <select
              id="skill_category"
              disabled={isSubmitting}
              {...register("categoryId")}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto appearance-none focus:outline-hidden focus:ring-1 focus:ring-cv-accent cursor-pointer transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="skill_mastery"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Mastery Level
            </label>
            <div className="space-y-2">
              <select
                id="skill_mastery"
                disabled={isSubmitting}
                {...register("mastery")}
                className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto appearance-none focus:outline-hidden focus:ring-1 focus:ring-cv-accent cursor-pointer transition-colors"
              >
                {masteryLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xs bg-zinc-100 dark:bg-zinc-800/50">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto">
                  Preview:
                </span>
                <SkillMasteryBar
                  mastery={selectedMastery || "Novice"}
                  skillName={currentSkillName || "Skill"}
                />
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  {selectedMastery || "Novice"}
                </span>
              </div>
            </div>
            {errors.mastery && (
              <p className="mt-1 text-xs text-destructive">
                {errors.mastery.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {isEdit && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                aria-label="Delete skill"
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
                    : "Add Skill"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
