import { cn } from "@/lib/utils";

export type MasteryLevel =
  "NoExpertise" | "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert";

interface MasteryVisualConfig {
  percentage: number;
  barColor: string;
  trackColor: string;
  label: string;
}

const MASTERY_MAP: Record<MasteryLevel, MasteryVisualConfig> = {
  NoExpertise: {
    percentage: 0,
    barColor: "bg-[#626262]",
    trackColor: "bg-[#454545]/60 dark:bg-sky-950/60",
    label: "No Expertise",
  },
  Novice: {
    percentage: 20,
    barColor: "bg-[#626262]",
    trackColor: "bg-[#454545]/60 dark:bg-sky-950/60",
    label: "Novice",
  },
  Advanced: {
    percentage: 40,
    barColor: "bg-[#29B6F6]",
    trackColor: "bg-[#145B7B] dark:bg-amber-950/60",
    label: "Advanced",
  },
  Competent: {
    percentage: 60,
    barColor: "bg-[#66BB6A]",
    trackColor: "bg-[#335D35] dark:bg-emerald-950/60",
    label: "Competent",
  },

  Proficient: {
    percentage: 80,
    barColor: "bg-[#FFB800]",
    trackColor: "bg-[#7F5C00] dark:bg-zinc-800",
    label: "Proficient",
  },
  Expert: {
    percentage: 100,
    barColor: "bg-cv-accent",
    trackColor: "bg-[#FFCDD2]/70 dark:bg-red-950/60",
    label: "Expert",
  },
};

interface SkillMasteryBarProps {
  mastery: MasteryLevel | string;
  skillName?: string;
  className?: string;
}

export function SkillMasteryBar({
  mastery,
  skillName,
  className,
}: SkillMasteryBarProps) {
  const normalizedMastery = (
    mastery
      ? mastery.charAt(0).toUpperCase() + mastery.slice(1).toLowerCase()
      : "Novice"
  ) as MasteryLevel;

  const config = MASTERY_MAP[normalizedMastery] || MASTERY_MAP.Novice;

  return (
    <div
      data-slot="skill-mastery-bar"
      role="progressbar"
      aria-label={skillName ? `${skillName}: ${config.label}` : config.label}
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
        data-slot="skill-mastery-fill"
        className={cn(
          "h-full rounded-full transition-all duration-300",
          config.barColor,
        )}
        style={{ width: `${config.percentage}%` }}
      />
    </div>
  );
}
