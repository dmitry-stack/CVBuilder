"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { CVProjectCard } from "./CVProjectCard";
import type {
  CvProjectItem,
  ProjectSortField,
  ProjectSortOrder,
} from "../../cvs/lib/cv-projects.utils";

interface CVProjectsListProps {
  projects: CvProjectItem[];
  isOwner: boolean;
  sortField: ProjectSortField;
  sortOrder: ProjectSortOrder;
  onSort: (field: ProjectSortField) => void;
  onEdit: (project: CvProjectItem) => void;
  onDelete: (project: CvProjectItem) => void;
  onAddClick?: () => void;
}

export function CVProjectsList({
  projects,
  isOwner,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onAddClick,
}: CVProjectsListProps) {
  const renderSortIndicator = (field: ProjectSortField) => {
    if (sortField !== field) {
      return <ArrowDown className="h-3.5 w-3.5 text-zinc-400 opacity-60" />;
    }
    return sortOrder === "asc" ? (
      <ArrowDown className="h-3.5 w-3.5 text-[#2E2E2E] dark:text-zinc-100" />
    ) : (
      <ArrowUp className="h-3.5 w-3.5 text-[#2E2E2E] dark:text-zinc-100" />
    );
  };

  return (
    <div data-slot="cv-projects-list" className="w-full">
      <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#AEAEAE]/60 dark:border-zinc-700 text-xs sm:text-sm font-medium text-[#2E2E2E] dark:text-zinc-200 font-roboto">
        <button
          type="button"
          onClick={() => onSort("name")}
          className="col-span-12 sm:col-span-4 flex items-center gap-1 hover:text-cv-accent transition-colors text-left cursor-pointer focus:outline-hidden"
        >
          <span>Name</span>
          {renderSortIndicator("name")}
        </button>

        <div className="col-span-6 sm:col-span-3 text-left">
          <span>Domain</span>
        </div>

        <button
          type="button"
          onClick={() => onSort("start_date")}
          className="col-span-3 sm:col-span-2 flex items-center gap-1 hover:text-cv-accent transition-colors text-left cursor-pointer focus:outline-hidden"
        >
          <span>Start Date</span>
          {renderSortIndicator("start_date")}
        </button>

        <button
          type="button"
          onClick={() => onSort("end_date")}
          className="col-span-3 sm:col-span-2 flex items-center gap-1 hover:text-cv-accent transition-colors text-left cursor-pointer focus:outline-hidden"
        >
          <span>End Date</span>
          {renderSortIndicator("end_date")}
        </button>

        <div className="col-span-12 sm:col-span-1" aria-hidden="true" />
      </div>

      {projects.length === 0 ? (
        <div
          data-testid="cv-projects-empty"
          className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg mt-6"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-roboto mb-4">
            No projects found in this CV.
          </p>
          {isOwner && onAddClick && (
            <button
              type="button"
              onClick={onAddClick}
              className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white px-6 py-2 text-xs uppercase font-medium tracking-wider shadow-cv-button transition-colors cursor-pointer"
            >
              Add Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-transparent">
          {projects.map((project) => (
            <CVProjectCard
              key={project.id}
              project={project}
              isOwner={isOwner}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
