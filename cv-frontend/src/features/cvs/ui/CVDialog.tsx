"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cvFormSchema, type CvFormData } from "../schemas/cv.schema";
import { useTranslation } from "@/i18n";

export interface CVDialogInitialData extends CvFormData {
  id?: string;
}

export interface CVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CvFormData & { id?: string }) => Promise<void> | void;
  onDelete?: (id: string, name?: string) => Promise<void> | void;
  initialData?: CVDialogInitialData | null;
  title?: string;
}

export function CVDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  title,
}: CVDialogProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(initialData?.id || initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CvFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      education: initialData?.education || "",
      description: initialData?.description || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || "",
        education: initialData?.education || "",
        description: initialData?.description || "",
      });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CvFormData) => {
    await onSave({
      ...data,
      id: initialData?.id,
    });
    onClose();
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    await onDelete(initialData.id, initialData.name);
    onClose();
  };

  const dialogTitle = title || (isEdit ? t("cvs.updateCv") : t("cvs.createCv"));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-dialog-title"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !isSubmitting) {
          e.stopPropagation();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 id="cv-dialog-title" className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto">
              {dialogTitle}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto mt-0.5">
              {isEdit ? t("cvs.updateSub") : t("cvs.createSub")}
            </p>
          </div>
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

        <form key={initialData?.id || "form-create"} onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <Input
            id="cv_name"
            label={`${t("cvs.cvName")} *`}
            alwaysShowLabel
            placeholder={t("cvs.namePlaceholder")}
            disabled={isSubmitting}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            id="cv_education"
            label={t("cvs.education")}
            alwaysShowLabel
            placeholder={t("cvs.educationPlaceholder")}
            disabled={isSubmitting}
            error={errors.education?.message}
            {...register("education")}
          />

          <Textarea
            id="cv_description"
            label={`${t("common.description")} *`}
            alwaysShowLabel
            rows={4}
            placeholder={t("cvs.descriptionPlaceholder")}
            disabled={isSubmitting}
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {isEdit && onDelete && initialData?.id ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                aria-label="Delete CV"
                className="inline-flex items-center gap-1.5 text-xs text-destructive hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t("common.delete")}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="shadow-cv-button">
                {isSubmitting ? t("common.saving") : isEdit ? t("common.saveChanges") : t("cvs.createCv")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateCVDialog(props: Omit<CVDialogProps, "initialData" | "title">) {
  return <CVDialog {...props} initialData={null} />;
}

export function UpdateCVDialog(props: CVDialogProps) {
  return <CVDialog {...props} />;
}
