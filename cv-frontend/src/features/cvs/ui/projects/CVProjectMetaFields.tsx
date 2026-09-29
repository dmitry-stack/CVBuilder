"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ChevronDown, Calendar, AlertCircle } from "lucide-react";
import type { CvProjectFormData } from "../../schemas/cv-project.schema";
import type { CvProjectItem } from "../../lib/cv-projects.utils";
import type { AvailableProjectItem } from "./CVProjectDialog";

interface CVProjectMetaFieldsProps {
  initialData: CvProjectItem | null;
  availableProjects: AvailableProjectItem[];
  selectedProjectId: string;
  onProjectSelect: (projId: string) => void;
  currentDomain: string;
  isOngoing: boolean;
  register: UseFormRegister<CvProjectFormData>;
  errors: FieldErrors<CvProjectFormData>;
}

export function CVProjectMetaFields({
  initialData,
  availableProjects,
  selectedProjectId,
  onProjectSelect,
  currentDomain,
  isOngoing,
  register,
  errors,
}: CVProjectMetaFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="proj_name_select"
            className="block text-xs font-normal text-zinc-500 mb-1"
          >
            Name
          </label>
          {initialData ? (
            <div className="h-10 px-3.5 rounded-[4px] bg-[#E2E2E4] dark:bg-zinc-800 flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300">
              <span className="truncate">{initialData.name}</span>
              <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0 ml-2" />
            </div>
          ) : (
            <div className="relative">
              <select
                id="proj_name_select"
                value={selectedProjectId}
                onChange={(e) => onProjectSelect(e.target.value)}
                className="w-full h-10 px-3.5 pr-8 rounded-[4px] bg-[#E2E2E4] dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 border border-transparent focus:outline-hidden focus:border-cv-accent appearance-none cursor-pointer"
              >
                {availableProjects.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            </div>
          )}
          {errors.projectId && (
            <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.projectId.message}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="proj_domain"
            className="block text-xs font-normal text-zinc-500 mb-1"
          >
            Domain
          </label>
          <div
            id="proj_domain"
            className="h-10 px-3.5 rounded-[4px] bg-[#E2E2E4] dark:bg-zinc-800 flex items-center text-sm text-zinc-700 dark:text-zinc-300 truncate"
          >
            {currentDomain || "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="p_start"
            className="block text-xs font-normal text-zinc-500 mb-1"
          >
            Start Date
          </label>
          <div className="relative">
            <input
              id="p_start"
              type="date"
              {...register("start_date")}
              className="w-full h-10 px-3.5 pr-9 rounded-[4px] border border-[#AEAEAE] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-cv-accent"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          </div>
          {errors.start_date && (
            <p className="mt-1 text-xs text-destructive">
              {errors.start_date.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="p_end"
            className="block text-xs font-normal text-zinc-500 mb-1"
          >
            End Date
          </label>
          <div className="relative">
            <input
              id="p_end"
              type="date"
              disabled={isOngoing}
              {...register("end_date")}
              className="w-full h-10 px-3.5 pr-9 rounded-[4px] border border-[#AEAEAE] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus:border-cv-accent"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          </div>
          {errors.end_date && (
            <p className="mt-1 text-xs text-destructive">
              {errors.end_date.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
