import { cn } from "@/lib/utils";

export type ProficiencyLevel =
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface ProficiencyVisualConfig {
  percentage: number;
  barColor: string;
  trackColor: string;
  label: string;
  description: string;
}

export const PROFICIENCY_MAP: Record<
  ProficiencyLevel,
  ProficiencyVisualConfig
> = {
  A1: {
    percentage: 15,
    barColor: "bg-[#626262]",
    trackColor: "bg-[#454545]/60 dark:bg-sky-950/60",
    label: "A1",
    description: "Beginner",
  },
  A2: {
    percentage: 30,
    barColor: "bg-[#626262]",
    trackColor: "bg-[#454545]/60 dark:bg-sky-950/60",
    label: "A2",
    description: "Elementary",
  },
  B1: {
    percentage: 45,
    barColor: "bg-[#29B6F6]",
    trackColor: "bg-[#145B7B] dark:bg-amber-950/60",
    label: "B1",
    description: "Intermediate",
  },
  B2: {
    percentage: 60,
    barColor: "bg-[#66BB6A]",
    trackColor: "bg-[#335D35] dark:bg-emerald-950/60",
    label: "B2",
    description: "Upper Intermediate",
  },
  C1: {
    percentage: 75,
    barColor: "bg-[#FFB800]",
    trackColor: "bg-[#7F5C00] dark:bg-zinc-800",
    label: "C1",
    description: "Advanced",
  },
  C2: {
    percentage: 90,
    barColor: "bg-cv-accent",
    trackColor: "bg-[#FFCDD2]/70 dark:bg-red-950/60",
    label: "C2",
    description: "Proficient",
  },
  Native: {
    percentage: 100,
    barColor: "bg-cv-accent",
    trackColor: "bg-[#FFCDD2]/70 dark:bg-red-950/60",
    label: "Native",
    description: "Native / Bilingual",
  },
};

interface LanguageProficiencyBarProps {
  proficiency: ProficiencyLevel | string;
  languageName?: string;
  className?: string;
}

export function LanguageProficiencyBar({
  proficiency,
  languageName,
  className,
}: LanguageProficiencyBarProps) {
  const normalizedKey = (
    proficiency?.toLowerCase() === "native"
      ? "Native"
      : proficiency?.toUpperCase() || "A1"
  ) as ProficiencyLevel;

  const config = PROFICIENCY_MAP[normalizedKey] || PROFICIENCY_MAP.A1;

  return (
    <div
      data-slot="language-proficiency-bar"
      role="progressbar"
      aria-label={
        languageName
          ? `${languageName}: ${config.label} (${config.description})`
          : `${config.label} (${config.description})`
      }
      aria-valuenow={config.percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative h-1 w-13 shrink-0 rounded-full overflow-hidden",
        config.trackColor,
        className,
      )}
    >
      <div
        data-slot="language-proficiency-fill"
        className={cn(
          "h-full rounded-full transition-all duration-300",
          config.barColor,
        )}
        style={{ width: `${config.percentage}%` }}
      />
    </div>
  );
}
