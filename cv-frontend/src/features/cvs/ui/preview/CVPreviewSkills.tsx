"use client";

import type { GroupedSkillCategory } from "../../lib/cv-skills.utils";
import {
  calculateSkillMetrics,
  type PreviewProjectItem,
} from "../../lib/cv-preview.utils";

interface CVPreviewSkillsProps {
  skillsGrouped: GroupedSkillCategory[];
  projects: PreviewProjectItem[];
}

export function CVPreviewSkills({
  skillsGrouped,
  projects,
}: CVPreviewSkillsProps) {
  if (skillsGrouped.length === 0) return null;

  return (
    <div className="pt-10 pb-16">
      <h2 className="text-xl sm:text-2xl font-normal text-zinc-900 dark:text-zinc-100 font-roboto mb-6">
        Professional skills
      </h2>

      <div className="w-full font-roboto overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[540px]">
          <thead>
            <tr className="border-b border-[#E57373] dark:border-red-900/60 pb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              <th className="py-2.5 font-bold w-[30%]">Skills</th>
              <th className="py-2.5 font-bold w-[35%]"></th>
              <th className="py-2.5 font-bold w-[18%] text-center leading-tight">
                Experience
                <br />
                in years
              </th>
              <th className="py-2.5 font-bold w-[17%] text-center leading-tight">
                Last used
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {skillsGrouped.map((cat) => (
              <tr key={cat.categoryName} className="align-top">
                <td className="py-3 pr-4 text-xs font-semibold text-cv-accent">
                  {cat.categoryName}
                </td>

                <td colSpan={3} className="py-2.5">
                  <div className="space-y-2">
                    {cat.items.map((skill) => {
                      const metrics = calculateSkillMetrics(
                        skill.name,
                        projects,
                      );

                      return (
                        <div
                          key={skill.name}
                          className="flex items-center text-xs"
                        >
                          <div className="w-[50%] font-medium text-zinc-900 dark:text-zinc-100">
                            {skill.name}
                          </div>
                          <div className="w-[25%] text-center text-zinc-700 dark:text-zinc-300">
                            {metrics.experienceYears !== "—"
                              ? metrics.experienceYears
                              : ""}
                          </div>
                          <div className="w-[25%] text-center text-zinc-700 dark:text-zinc-300">
                            {metrics.lastUsedYear !== "—"
                              ? metrics.lastUsedYear
                              : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
