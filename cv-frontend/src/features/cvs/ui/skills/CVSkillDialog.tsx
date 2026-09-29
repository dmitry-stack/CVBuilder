"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cvSkillFormSchema,
  type CvSkillFormData,
} from "../../schemas/cv-skill.schema";

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
  const isEdit = Boolean(initialData?.name);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = useForm<CvSkillFormData>({
    resolver: zodResolver(cvSkillFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const selectedName = useWatch({
    control,
    name: "name",
    defaultValue: initialData?.name || "",
  });
  const isSubmitting = propIsSubmitting || formIsSubmitting;

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || "",
      });
    }
  }, [isOpen, initialData, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const onSubmit = async (data: CvSkillFormData) => {
    await onSave(data.name);
    onClose();
  };

  const dialogTitle = isEdit ? "Update skill" : "Add skill";

  // Build the list of selectable options:
  // In edit mode, ensure the currently selected skill is in the options even if it was previously filtered
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2
            id="cv-skill-dialog-title"
            className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
          >
            {dialogTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-sm focus:outline-hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="cv-skill-select"
                className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1 font-roboto"
              >
                Skill
              </label>
              <div className="relative">
                <select
                  id="cv-skill-select"
                  {...register("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "cv-skill-error" : undefined}
                  className="w-full h-10 px-3.5 pr-8 rounded-[4px] bg-[#E2E2E4] dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 border border-transparent focus:outline-hidden focus:border-cv-accent appearance-none cursor-pointer"
                >
                  <option value="">Select skill</option>
                  {options.map((opt) => (
                    <option
                      key={opt.name}
                      value={opt.name}
                      className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    >
                      {opt.name}
                    </option>
                  ))}
                  {options.length === 0 && (
                    <option value="" disabled>
                      No skills available in profile
                    </option>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
              {errors.name && (
                <p
                  id="cv-skill-error"
                  className="flex items-center gap-1 text-xs text-destructive mt-1.5 font-roboto"
                >
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full px-4 h-9 text-xs font-medium uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedName}
              className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white px-6 h-9 text-xs font-medium uppercase tracking-wider shadow-cv-button transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
