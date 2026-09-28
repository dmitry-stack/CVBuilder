"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  formatProjectDate,
  type CvProjectItem,
} from "../../cvs/lib/cv-projects.utils";

interface CVProjectCardProps {
  project: CvProjectItem;
  isOwner: boolean;
  onEdit: (project: CvProjectItem) => void;
  onDelete: (project: CvProjectItem) => void;
}

export function CVProjectCard({
  project,
  isOwner,
  onEdit,
  onDelete,
}: CVProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div
      data-slot="cv-project-card"
      data-testid={`project-card-${project.id}`}
      className="border-b border-[#AEAEAE]/40 dark:border-zinc-800 py-5 font-roboto"
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 sm:col-span-4 font-normal text-sm sm:text-base text-[#2E2E2E] dark:text-zinc-100 truncate">
          {project.name}
        </div>

        <div className="col-span-6 sm:col-span-3 text-sm text-zinc-600 dark:text-zinc-400 truncate">
          {project.domain}
        </div>

        <div className="col-span-3 sm:col-span-2 text-sm text-zinc-600 dark:text-zinc-400">
          {formatProjectDate(project.start_date)}
        </div>

        <div className="col-span-3 sm:col-span-2 text-sm text-zinc-600 dark:text-zinc-400">
          {formatProjectDate(project.end_date)}
        </div>

        <div className="col-span-12 sm:col-span-1 flex justify-end relative">
          {isOwner && (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label={`Actions for ${project.name}`}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer rounded-xs"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {isMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 w-36 rounded-md bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black/5 dark:ring-zinc-800 py-1 z-20"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit(project);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete(project);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-roboto leading-relaxed mt-3 mb-3">
          {project.description}
        </p>
      )}

      {project.responsibilities && project.responsibilities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {project.responsibilities
            .filter((r) => r.trim().length > 0)
            .map((resp, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-roboto bg-[#E2E2E4] dark:bg-zinc-800 text-[#2E2E2E] dark:text-zinc-200"
              >
                {resp}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
