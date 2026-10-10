"use client";

import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import type { CvProjectFormData } from "../../schemas/cv-project.schema";
import type { CvProjectItem } from "../../lib/cv-projects.utils";
import { CVProjectEnvironmentInput } from "./CVProjectEnvironmentInput";
import { CVProjectRoleInput } from "./CVProjectRoleInput";
import { CVProjectMetaFields } from "./CVProjectMetaFields";
import { useCVProjectDialogForm } from "../../hooks/useCVProjectDialogForm";
import { useTranslation } from "@/i18n";

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
  const { t } = useTranslation();
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
    handleSubmit,
    errors,
    isSubmitting,
    handleProjectSelect,
    onFormSubmit,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
  } = useCVProjectDialogForm({
    initialData,
    availableProjects,
    onSave,
  });

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-150 max-w-[860px] max-h-[min(680px,calc(100dvh-2rem))] flex flex-col bg-[#F5F5F7] dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 font-roboto overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-4 pb-2 shrink-0">
        <h2 id="dialog-title" className="text-xl font-medium leading-6 tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
          {initialData ? t("projects.updateProject") : t("projects.addProjectTitle")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1 text-[#2E2E2E] dark:text-zinc-300 hover:opacity-75 transition-opacity cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
        <div className="px-6 py-2 space-y-4 overflow-y-auto select-scrollbar flex-1">
          <CVProjectMetaFields
            initialData={initialData}
            availableProjects={availableProjects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={handleProjectSelect}
            currentDomain={currentDomain}
            isOngoing={isOngoing}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            errors={errors}
          />

          <Textarea
            id="p_desc"
            label={t("common.description")}
            alwaysShowLabel
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description"
            className="w-full min-h-[108px]"
          />

          <div>
            <label className="block text-xs font-normal text-[#626262] dark:text-zinc-400 mb-1 tracking-[0.15px]">
              {t("preview.environment")}
            </label>
            <CVProjectEnvironmentInput tags={environmentTags} onChange={setEnvironmentTags} />
          </div>

          <div>
            <label htmlFor="p_roles" className="block text-xs font-normal text-[#626262] dark:text-zinc-400 mb-1 tracking-[0.15px]">
              {t("projects.roles")}
            </label>
            <CVProjectRoleInput value={rolesText} onChange={setRolesText} />
          </div>

          <Input
            id="p_resp"
            label={t("preview.responsibilities")}
            alwaysShowLabel
            type="text"
            value={respText}
            onChange={(e) => setRespText(e.target.value)}
            placeholder="Did something great, Did not break production"
          />
        </div>

        <div className="flex justify-end items-center gap-6 px-6 py-4 shrink-0 bg-[#F5F5F7] dark:bg-zinc-900 border-t border-zinc-200/50 dark:border-zinc-800">
          <Button type="button" variant="outline" size="xl" onClick={onClose} disabled={isSubmitting} className="w-40">
            {t("common.cancel")}
          </Button>
          <Button type="submit" size="xl" disabled={isSubmitting} className="w-40 shadow-cv-button">
            {isSubmitting ? t("common.saving") : initialData ? t("common.update") : t("common.add")}
          </Button>
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
