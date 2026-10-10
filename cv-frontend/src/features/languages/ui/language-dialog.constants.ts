import { proficiencyLevels, type ProficiencyType } from "../schemas/language.schema";
import type { SelectOption } from "@/shared/components/ui/select";

export const PROFICIENCY_LABELS: Record<ProficiencyType, string> = {
  A1: "A1 - Beginner",
  A2: "A2 - Elementary",
  B1: "B1 - Intermediate",
  B2: "B2 - Upper Intermediate",
  C1: "C1 - Advanced",
  C2: "C2 - Proficient / Mastery",
  Native: "Native - Native / Bilingual",
};

export const PROFICIENCY_OPTIONS: SelectOption[] = proficiencyLevels.map((lvl) => ({
  value: lvl,
  label: PROFICIENCY_LABELS[lvl],
}));
