"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle } from "lucide-react";
import {
  cvProjectFormSchema,
  type CvProjectFormData,
} from "../../cvs/schemas/cv-project.schema";
import type { CvProjectItem } from "../../cvs/lib/cv-projects.utils";

export interface AvailableProjectItem {
  id: string;
  name: string;
  domain: string;
}

interface CVProjectDialogProps {
  isOpen: boolean;
  initialData: CvProjectItem | null;
  availableProjects: AvailableProjectItem[];
  onClose: () => void;
  onSave: (data: CvProjectFormData) => Promise<void>;
}

function CVProjectDialogContent({
  initialData,
  availableProjects,
  onClose,
  onSave,
}: Omit<CVProjectDialogProps, "isOpen">) {
  const [isOngoing, setIsOngoing] = useState(
    () => !initialData?.end_date && Boolean(initialData),
  );
  const [respText, setRespText] = useState(() =>
    (initialData?.responsibilities || []).join("\n"),
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CvProjectFormData>({
    resolver: zodResolver(cvProjectFormSchema),
    defaultValues: {
      projectId:
        initialData?.project?.id ||
        initialData?.id ||
        availableProjects[0]?.id ||
        "",
      start_date: initialData?.start_date || "",
      end_date: initialData?.end_date || null,
      roles: initialData?.roles || [],
      responsibilities: initialData?.responsibilities || [],
    },
  });

  const onFormSubmit = async (data: CvProjectFormData) => {
    const lines = respText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    await onSave({
      ...data,
      end_date: isOngoing ? null : data.end_date || null,
      responsibilities: lines,
    });
  };

  return (
    <div className="w-full max-w-lg rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2
          id="dialog-title"
          className="text-base font-medium text-zinc-900 dark:text-zinc-100"
        >
          {initialData ? "Edit CV Project" : "Add Project to CV"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
        <div>
          <label
            htmlFor="proj_select"
            className="block text-xs font-normal text-zinc-600 dark:text-zinc-400 mb-1"
          >
            Project
          </label>
          {initialData ? (
            <div className="h-10 px-3.5 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/60 flex items-center text-sm text-zinc-900 dark:text-zinc-100">
              {initialData.name} ({initialData.domain})
            </div>
          ) : (
            <select
              id="proj_select"
              {...register("projectId")}
              className="w-full h-10 px-3 rounded-xs border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-cv-accent"
            >
              {availableProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.domain})
                </option>
              ))}
            </select>
          )}
          {errors.projectId && (
            <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.projectId.message}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="p_start"
              className="block text-xs font-normal text-zinc-600 dark:text-zinc-400 mb-1"
            >
              Start Date
            </label>
            <input
              id="p_start"
              type="date"
              {...register("start_date")}
              className="w-full h-10 px-3 rounded-xs border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-cv-accent"
            />
            {errors.start_date && (
              <p className="mt-1 text-xs text-destructive">
                {errors.start_date.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="p_end"
              className="block text-xs font-normal text-zinc-600 dark:text-zinc-400 mb-1"
            >
              End Date
            </label>
            <input
              id="p_end"
              type="date"
              disabled={isOngoing}
              {...register("end_date")}
              className="w-full h-10 px-3 rounded-xs border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus:border-cv-accent"
            />
            {errors.end_date && (
              <p className="mt-1 text-xs text-destructive">
                {errors.end_date.message}
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isOngoing}
            onChange={(e) => {
              setIsOngoing(e.target.checked);
              if (e.target.checked) setValue("end_date", null);
            }}
            className="h-4 w-4 rounded-xs border-zinc-300 dark:border-zinc-600 text-cv-accent focus:ring-cv-accent"
          />
          <span className="text-xs text-zinc-600 dark:text-zinc-300">
            Till now (ongoing project)
          </span>
        </label>

        <div>
          <label
            htmlFor="p_resp"
            className="block text-xs font-normal text-zinc-600 dark:text-zinc-400 mb-1"
          >
            Responsibilities (one per line)
          </label>
          <textarea
            id="p_resp"
            rows={3}
            value={respText}
            onChange={(e) => setRespText(e.target.value)}
            placeholder="e.g. Managed to write code in time"
            className="w-full p-3 rounded-xs border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-cv-accent resize-y"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full px-5 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full px-6 py-2 text-sm font-medium uppercase tracking-wider text-white bg-cv-accent hover:bg-cv-accent-hover shadow-cv-button cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CVProjectDialog(props: CVProjectDialogProps) {
  if (!props.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-roboto"
    >
      <CVProjectDialogContent
        key={props.initialData?.id || "create"}
        initialData={props.initialData}
        availableProjects={props.availableProjects}
        onClose={props.onClose}
        onSave={props.onSave}
      />
    </div>
  );
}
