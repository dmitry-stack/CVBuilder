"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/i18n";
import type { SortField, SortOrder } from "../hooks/useCvsTable";

export interface CVTableHeaderProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export function CVTableHeader({
  sortField,
  sortOrder,
  onSort,
}: CVTableHeaderProps) {
  const { t } = useTranslation();

  return (
    <thead>
      <tr className="h-table-header border-b border-zinc-200 dark:border-zinc-800 bg-transparent">
        <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
          <button
            type="button"
            onClick={() => onSort("name")}
            className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
          >
            <span>{t("common.name")}</span>
            {sortField === "name" &&
              (sortOrder === "asc" ? (
                <ChevronDown className="h-4 w-4 text-cv-muted" />
              ) : (
                <ChevronUp className="h-4 w-4 text-cv-muted" />
              ))}
          </button>
        </th>

        <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
          <button
            type="button"
            onClick={() => onSort("education")}
            className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
          >
            <span>{t("cvs.education")}</span>
            {sortField === "education" &&
              (sortOrder === "asc" ? (
                <ChevronDown className="h-4 w-4 text-cv-muted" />
              ) : (
                <ChevronUp className="h-4 w-4 text-cv-muted" />
              ))}
          </button>
        </th>

        <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
          <button
            type="button"
            onClick={() => onSort("employee")}
            className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
          >
            <span>{t("cvs.employee")}</span>
            {sortField === "employee" &&
              (sortOrder === "asc" ? (
                <ChevronDown className="h-4 w-4 text-cv-muted" />
              ) : (
                <ChevronUp className="h-4 w-4 text-cv-muted" />
              ))}
          </button>
        </th>

        <th className="w-18 px-4" aria-label="Actions" />
      </tr>
    </thead>
  );
}
