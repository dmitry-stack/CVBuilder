"use client";

import { Fragment } from "react";
import { DropdownMenuButton } from "@/components/ui/DropDownButton";
import { useTranslation } from "@/i18n";
import type { CVItem } from "../hooks/useCvsTable";

export interface CVTableRowProps {
  cv: CVItem;
  index: number;
  isOwner?: boolean;
  onNavigate: (cv: CVItem) => void;
  onOpenEdit: (cv: CVItem) => void;
  onOpenDelete: (cv: CVItem) => void;
}

export function CVTableRow({
  cv,
  index,
  isOwner,
  onNavigate,
  onOpenEdit,
  onOpenDelete,
}: CVTableRowProps) {
  const { t } = useTranslation();

  const employeeDisplay = cv.user?.email || t("cvs.unknownEmployee");

  return (
    <Fragment>
      <tr
        onClick={() => onNavigate(cv)}
        className={`h-table-row hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer ${
          index > 0 ? "border-t border-zinc-200 dark:border-zinc-800" : ""
        }`}
      >
        <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100">
          {cv.name || ""}
        </td>

        <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100">
          {cv.education || ""}
        </td>

        <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100 truncate max-w-email">
          {employeeDisplay}
        </td>

        <td
          className="px-4 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuButton
            id={cv.id}
            viewHref={`/cvs/${cv.id}/details`}
            onUpdate={isOwner ? () => onOpenEdit(cv) : undefined}
            onDelete={isOwner ? () => onOpenDelete(cv) : undefined}
          />
        </td>
      </tr>
      <tr
        onClick={() => onNavigate(cv)}
        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors border-t-0 cursor-pointer"
      >
        <td colSpan={4} className="px-4 py-2 border-t-0">
          <div className="font-roboto text-sm leading-5 tracking-cv text-cv-text/50 dark:text-zinc-100">
            {cv.description}
          </div>
        </td>
      </tr>
    </Fragment>
  );
}
