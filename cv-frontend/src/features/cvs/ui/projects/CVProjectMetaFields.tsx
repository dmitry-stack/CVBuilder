"use client";

import { useMemo } from "react";
import { FieldErrors } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { Select, type SelectOption } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useTranslation } from "@/i18n";
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
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  errors: FieldErrors<CvProjectFormData>;
}

export function CVProjectMetaFields({
  initialData,
  availableProjects,
  selectedProjectId,
  onProjectSelect,
  currentDomain,
  isOngoing,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  errors,
}: CVProjectMetaFieldsProps) {
  const { t } = useTranslation();

  const projectOptions: SelectOption[] = useMemo(
    () =>
      availableProjects.map((p) => ({
        value: String(p.id),
        label: p.name,
      })),
    [availableProjects],
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {initialData ? (
            <div>
              <label
                htmlFor="proj_name_static"
                className="block text-xs font-normal text-[#626262] dark:text-zinc-400 mb-1 tracking-[0.15px]"
              >
                {t("common.name")}
              </label>
              <div
                id="proj_name_static"
                className="h-12 px-3.5 border border-[#AEAEAE] dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-between text-sm text-[#2E2E2E] dark:text-zinc-100"
              >
                <span className="truncate">{initialData.name}</span>
                <ChevronDown className="h-5 w-5 text-[#626262] shrink-0 ml-2" />
              </div>
            </div>
          ) : (
            <Select
              id="proj_name_select"
              label={t("common.name")}
              alwaysShowLabel
              placeholder={t("projects.selectProject")}
              options={projectOptions}
              value={selectedProjectId}
              onChange={onProjectSelect}
              error={errors.projectId?.message}
            />
          )}
        </div>

        <div>
          <label
            htmlFor="proj_domain"
            className="block text-xs font-normal text-[#626262] dark:text-zinc-400 mb-1 tracking-[0.15px]"
          >
            {t("projects.domain")}
          </label>
          <div
            id="proj_domain"
            className="h-12 px-3.5 bg-[#C4C4C6] dark:bg-zinc-800 border border-[#AEAEAE] dark:border-zinc-700 flex items-center text-sm text-[#2E2E2E] dark:text-zinc-300 truncate"
          >
            {currentDomain || "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <DatePicker
            id="p_start"
            label={t("projects.startDate")}
            alwaysShowLabel
            value={startDate}
            onChange={onStartDateChange}
            error={errors.start_date?.message}
          />
        </div>

        <div>
          <DatePicker
            id="p_end"
            label={t("projects.endDate")}
            alwaysShowLabel
            disabled={isOngoing}
            value={endDate}
            onChange={onEndDateChange}
            error={errors.end_date?.message}
          />
        </div>
      </div>
    </>
  );
}
