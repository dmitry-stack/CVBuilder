"use client";

import { X } from "lucide-react";
import type { CvProjectFormData } from "../../schemas/cv-project.schema";
import type { CvProjectItem } from "../../lib/cv-projects.utils";
import { CVProjectEnvironmentInput } from "./CVProjectEnvironmentInput";
import { CVProjectRoleInput } from "./CVProjectRoleInput";
import { CVProjectMetaFields } from "./CVProjectMetaFields";
import { useCVProjectDialogForm } from "../../hooks/useCVProjectDialogForm";

export interface AvailableProjectItem {
  id: string;
  name: string;
  domain: string;
  description?: string;
  environment?: string[];
  start_date?: string;
  end_date?: string | null;
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
  const {
    selectedProjectId,
    currentDomain,
    description,
    setDescription,
    environmentTags,
    setEnvironmentTags,
    rolesText,
    setRolesText,
    respText,
    setRespText,
    isOngoing,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleProjectSelect,
    onFormSubmit,
  } = useCVProjectDialogForm({
    initialData,
    availableProjects,
    onSave,
  });

  return (
    <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-800 font-roboto">
      <div className="flex items-center justify-between pb-3">
        <h2
          id="dialog-title"
          className="text-xl font-medium text-zinc-900 dark:text-zinc-100"
        >
          {initialData ? "Update project" : "Add Project to CV"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
        <CVProjectMetaFields
          initialData={initialData}
          availableProjects={availableProjects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
          currentDomain={currentDomain}
          isOngoing={isOngoing}
          register={register}
          errors={errors}
        />

        <div>
          <label
            htmlFor="p_desc"
            className="block text-xs font-normal text-zinc-500 mb-1"
          >
            Description
          </label>
          <textarea
            id="p_desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description"
            className="w-full p-3 rounded-[4px] bg-[#E2E2E4] dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed border border-transparent focus:outline-hidden focus:border-zinc-400 resize-y min-h-[84px]"
          />
        </div>

        <div>
          <label className="block text-xs font-normal text-zinc-500 mb-1">
            Environment
          </label>
          <CVProjectEnvironmentInput
            tags={environmentTags}
            onChange={setEnvironmentTags}
          />
        </div>

        <div>
          <label
            htmlFor="p_roles"
            className="block text-xs font-normal text-zinc-500 mb-1"
          >
            Roles
          </label>
          <CVProjectRoleInput value={rolesText} onChange={setRolesText} />
        </div>

        <div>
          <label
            htmlFor="p_resp"
            className="block text-xs font-normal text-zinc-500 mb-1"
          >
            Responsibilities
          </label>
          <input
            id="p_resp"
            type="text"
            value={respText}
            onChange={(e) => setRespText(e.target.value)}
            placeholder="e.g. Did something great, Did not break production"
            className="w-full h-10 px-3.5 rounded-[4px] border border-[#AEAEAE] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-cv-accent"
          />
        </div>

        <div className="flex justify-end items-center gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-[40px] px-8 py-2 text-sm font-medium tracking-wide uppercase border border-zinc-900 dark:border-zinc-300 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-[40px] px-8 py-2 text-sm font-medium tracking-wide uppercase text-white bg-cv-accent hover:bg-cv-accent-hover shadow-cv-button transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Add"}
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
