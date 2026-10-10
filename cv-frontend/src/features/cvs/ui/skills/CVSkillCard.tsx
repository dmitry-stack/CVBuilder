"use client";

import { Check, Pencil } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SkillMasteryBar } from "@/features/skills/ui/SkillMasteryBar";
import type { SkillItem } from "../../lib/cv-skills.utils";

interface CVSkillCardProps {
  skill: SkillItem;
  isOwner: boolean;
  isDeleteMode: boolean;
  isSelected: boolean;
  onToggleSelect: (name: string) => void;
  onEditClick: (skill: SkillItem) => void;
}

export function CVSkillCard({
  skill,
  isOwner,
  isDeleteMode,
  isSelected,
  onToggleSelect,
  onEditClick,
}: CVSkillCardProps) {
  const handleClick = () => {
    if (isDeleteMode) {
      onToggleSelect(skill.name);
    } else if (isOwner) {
      onEditClick(skill);
    }
  };

  return (
    <div
      data-slot="skill-item"
      data-testid={`skill-card-${skill.name}`}
      role={isDeleteMode ? "checkbox" : undefined}
      aria-checked={isDeleteMode ? isSelected : undefined}
      tabIndex={isDeleteMode || isOwner ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (isDeleteMode && (e.key === " " || e.key === "Enter")) {
          e.preventDefault();
          onToggleSelect(skill.name);
        } else if (
          !isDeleteMode &&
          isOwner &&
          (e.key === " " || e.key === "Enter")
        ) {
          e.preventDefault();
          onEditClick(skill);
        }
      }}
      className={cn(
        "group relative flex items-center justify-between py-1.5 rounded-sm transition-all px-2 -mx-2",
        isDeleteMode
          ? cn(
              "cursor-pointer select-none",
              isSelected
                ? "bg-red-50/70 dark:bg-red-950/25 ring-1 ring-[#C63031]/30"
                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40",
            )
          : isOwner
            ? "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
            : "",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {isDeleteMode && (
          <div
            data-slot="selection-checkbox"
            className={cn(
              "h-4 w-4 shrink-0 rounded-xs border transition-colors flex items-center justify-center",
              isSelected
                ? "bg-[#C63031] border-[#C63031] text-white"
                : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900",
            )}
          >
            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
        )}
        <SkillMasteryBar mastery={skill.mastery} skillName={skill.name} />
        <span
          className={cn(
            "text-sm font-normal font-roboto truncate transition-colors",
            isSelected
              ? "text-[#C63031] dark:text-[#E04B4C] font-medium"
              : "text-zinc-800 dark:text-zinc-200",
          )}
        >
          {skill.name}
        </span>
      </div>

      {isOwner && !isDeleteMode && (
        <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(skill);
            }}
            aria-label={`Edit ${skill.name}`}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer rounded-xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
