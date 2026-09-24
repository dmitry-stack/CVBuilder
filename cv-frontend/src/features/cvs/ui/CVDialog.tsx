"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cvFormSchema, type CvFormData } from "../schemas/cv.schema";

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

  const dialogTitle = title || (isEdit ? "Update CV" : "Create CV");

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
      <div className="w-full max-w-lg rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2
              id="cv-dialog-title"
              className="text-base font-medium text-zinc-900 dark:text-zinc-100 font-roboto"
            >
              {dialogTitle}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto mt-0.5">
              {isEdit
                ? "Update your resume details and summary"
                : "Fill in the details below to create a new CV"}
            </p>
          </div>
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

        <form
          key={initialData?.id || "form-create"}
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5"
        >
          <div>
            <label
              htmlFor="cv_name"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              CV Name <span className="text-destructive">*</span>
            </label>
            <input
              id="cv_name"
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              disabled={isSubmitting}
              defaultValue={initialData?.name || ""}
              {...register("name")}
              aria-invalid={!!errors.name}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1 font-roboto">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="cv_education"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Education
            </label>
            <input
              id="cv_education"
              type="text"
              placeholder="e.g. Bachelor of Science in Computer Science"
              disabled={isSubmitting}
              defaultValue={initialData?.education || ""}
              {...register("education")}
              aria-invalid={!!errors.education}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
            {errors.education && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1 font-roboto">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.education.message}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="cv_description"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              id="cv_description"
              rows={4}
              placeholder="Summarize your professional background, key achievements, and career focus..."
              disabled={isSubmitting}
              defaultValue={initialData?.description || ""}
              {...register("description")}
              aria-invalid={!!errors.description}
              className="w-full p-3 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors resize-y disabled:opacity-70 disabled:cursor-not-allowed placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1 font-roboto">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.description.message}</span>
              </p>
            )}
          </div>

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
                    : "Create CV"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Convenience wrapper for Create dialog
export function CreateCVDialog(
  props: Omit<CVDialogProps, "initialData" | "title">,
) {
  return <CVDialog {...props} initialData={null} title="Create CV" />;
}

// Convenience wrapper for Update dialog
export function UpdateCVDialog(props: CVDialogProps) {
  return <CVDialog {...props} title={props.title || "Update CV"} />;
}
