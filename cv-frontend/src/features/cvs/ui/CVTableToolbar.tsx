"use client";

import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

export interface CVTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  isOwner?: boolean;
  onOpenCreate: () => void;
}

export function CVTableToolbar({
  search,
  onSearchChange,
  isOwner,
  onOpenCreate,
}: CVTableToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-1">
      <div className="relative w-full max-w-search">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cv-muted dark:text-zinc-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder={t("cvs.searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-full border border-cv-border dark:border-zinc-700 bg-transparent text-base leading-cv-input text-cv-text dark:text-zinc-100 placeholder:text-cv-placeholder focus:outline-hidden focus:border-cv-text dark:focus:border-zinc-400 transition-colors"
          aria-label={t("cvs.searchAria")}
        />
      </div>

      {isOwner && (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="primary-v2"
            size="sm"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t("cvs.createCv")}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
