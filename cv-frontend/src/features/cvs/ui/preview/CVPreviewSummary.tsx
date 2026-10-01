"use client";

import type { GroupedSkillCategory } from "../../lib/cv-skills.utils";
import { useTranslation } from "@/i18n";

interface LanguageItem {
  name: string;
  proficiency: string;
}

interface CVPreviewSummaryProps {
  cvName: string;
  education?: string | null;
  description: string;
  languages: LanguageItem[];
  domains: string[];
  skillsGrouped: GroupedSkillCategory[];
}

export function CVPreviewSummary({
  cvName,
  education,
  description,
  languages,
  domains,
  skillsGrouped,
}: CVPreviewSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 pt-6 cv-preview-two-col">
      <div className="w-full md:w-[32%] shrink-0 space-y-6 cv-preview-col-left">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
            {t("cvs.education")}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto mt-1 leading-relaxed">
            {education || "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
            {t("preview.languageProficiency")}
          </h2>
          {languages.length > 0 ? (
            <div className="space-y-1 mt-1">
              {languages.map((lang) => (
                <p
                  key={lang.name}
                  className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto"
                >
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {lang.name}
                  </span>
                  {lang.proficiency ? ` (${lang.proficiency})` : ""}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-roboto mt-1">
              —
            </p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
            {t("preview.domains")}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto mt-1 leading-relaxed">
            {domains.length > 0 ? domains.join(", ") : "—"}
          </p>
        </div>
      </div>

      <div className="w-full md:w-[68%] pl-0 md:pl-6 border-l-0 md:border-l-2 border-[#E57373] dark:border-red-900/60 space-y-4 cv-preview-col-right">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
            {cvName}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {skillsGrouped.length > 0 && (
          <div className="pt-2 space-y-3">
            {skillsGrouped.map((cat) => (
              <div key={cat.categoryName}>
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-roboto">
                  {cat.categoryName}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-roboto mt-0.5 leading-relaxed">
                  {cat.items.map((i) => i.name).join(", ")}.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
