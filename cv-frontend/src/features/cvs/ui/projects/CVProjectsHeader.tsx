"use client";

import { Search, Plus } from "lucide-react";

interface CVProjectsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  isOwner: boolean;
  onAddClick: () => void;
}

export function CVProjectsHeader({
  search,
  onSearchChange,
  isOwner,
  onAddClick,
}: CVProjectsHeaderProps) {
  return (
    <div
      data-slot="cv-projects-header"
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
    >
      <div className="relative w-full max-w-xs">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search projects"
          className="w-full h-10 pl-10 pr-4 rounded-full border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-sm text-[#2E2E2E] dark:text-zinc-100 placeholder:text-cv-placeholder focus:outline-hidden focus:border-cv-accent transition-colors"
        />
      </div>

      {isOwner && (
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-cv-accent dark:text-[#E04B4C] hover:opacity-80 transition-opacity cursor-pointer self-start sm:self-auto py-2"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add Project</span>
        </button>
      )}
    </div>
  );
}
