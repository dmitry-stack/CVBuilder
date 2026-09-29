"use client";

import { CVSkillCard } from "./CVSkillCard";
import type {
  GroupedSkillCategory,
  SkillItem,
} from "../../lib/cv-skills.utils";

interface CVSkillsListProps {
  groupedSkills: GroupedSkillCategory[];
  isOwner: boolean;
  isDeleteMode: boolean;
  selectedSkills: Set<string>;
  onToggleSelect: (name: string) => void;
  onEditClick: (skill: SkillItem) => void;
}

export function CVSkillsList({
  groupedSkills,
  isOwner,
  isDeleteMode,
  selectedSkills,
  onToggleSelect,
  onEditClick,
}: CVSkillsListProps) {
  return (
    <div className="space-y-8">
      {groupedSkills.map(({ categoryName, items }) => (
        <section
          key={categoryName}
          data-slot="skill-category-section"
          className="space-y-4"
        >
          <h2 className="text-base font-normal text-[#2E2E2E] dark:text-zinc-100 font-roboto">
            {categoryName}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {items.map((skill) => (
              <CVSkillCard
                key={skill.name}
                skill={skill}
                isOwner={isOwner}
                isDeleteMode={isDeleteMode}
                isSelected={selectedSkills.has(skill.name)}
                onToggleSelect={onToggleSelect}
                onEditClick={onEditClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
