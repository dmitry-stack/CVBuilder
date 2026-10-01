"use client";

import {
  formatPreviewPeriod,
  formatResponsibilities,
} from "../../lib/cv-preview.utils";

export interface PreviewProjectData {
  id: string;
  name: string;
  description: string;
  domain?: string | null;
  start_date: string;
  end_date?: string | null;
  environment?: string[] | null;
  roles?: string[] | null;
  responsibilities?: string[] | null;
}

interface CVPreviewProjectsProps {
  projects: PreviewProjectData[];
}

export function CVPreviewProjects({ projects }: CVPreviewProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <div className="pt-10">
      <h2 className="text-xl sm:text-2xl font-normal text-zinc-900 dark:text-zinc-100 font-roboto mb-6">
        Projects
      </h2>

      <div className="space-y-8">
        {projects.map((project) => {
          const responsibilitiesList = formatResponsibilities(
            project.responsibilities,
          );
          const periodStr = formatPreviewPeriod(
            project.start_date,
            project.end_date,
          );
          const rolesStr = project.roles?.join(", ") || "—";
          const envStr = project.environment?.join(", ") || "—";

          return (
            <div
              key={project.id}
              className="flex flex-col md:flex-row gap-6 md:gap-8 cv-preview-two-col"
            >
              <div className="w-full md:w-[32%] shrink-0 cv-preview-col-left">
                <h3 className="text-sm font-bold text-cv-accent uppercase tracking-wide font-roboto">
                  {project.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto mt-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="w-full md:w-[68%] pl-0 md:pl-6 border-l-0 md:border-l-2 border-[#E57373] dark:border-red-900/60 space-y-4 cv-preview-col-right">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
                    Project roles
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto mt-0.5 leading-relaxed">
                    {rolesStr}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
                    Period
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto mt-0.5 leading-relaxed">
                    {periodStr}
                  </p>
                </div>

                {responsibilitiesList.length > 0 && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
                      Responsibilities
                    </h4>
                    <ul className="mt-1 space-y-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto leading-relaxed">
                      {responsibilitiesList.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-zinc-400 select-none">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
                    Environment
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto mt-0.5 leading-relaxed">
                    {envStr}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
