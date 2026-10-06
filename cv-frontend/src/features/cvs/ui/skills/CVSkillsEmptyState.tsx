"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

interface CVSkillsEmptyStateProps {
  isOwner: boolean;
  onAddClick: () => void;
}

export function CVSkillsEmptyState({
  isOwner,
  onAddClick,
}: CVSkillsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div
      data-slot="skills-empty-state"
      data-testid="cv-skills-empty"
      className="w-full py-16 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800"
    >
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        {t("cvSkills.noSkillsAdded")}
      </p>
      {isOwner && (
        <Button type="button" onClick={onAddClick}>
          {t("skills.addSkill")}
        </Button>
      )}
    </div>
  );
}
