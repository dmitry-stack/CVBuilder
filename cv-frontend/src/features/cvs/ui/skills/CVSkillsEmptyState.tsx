"use client";

import { Button } from "@/components/ui/button";

interface CVSkillsEmptyStateProps {
  isOwner: boolean;
  onAddClick: () => void;
}

export function CVSkillsEmptyState({
  isOwner,
  onAddClick,
}: CVSkillsEmptyStateProps) {
  return (
    <div
      data-slot="skills-empty-state"
      data-testid="cv-skills-empty"
      className="w-full py-16 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800"
    >
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        No skills added yet
      </p>
      {isOwner && (
        <Button
          type="button"
          onClick={onAddClick}
          className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white text-xs px-5 h-9 uppercase font-medium tracking-wider cursor-pointer"
        >
          Add Skill
        </Button>
      )}
    </div>
  );
}
