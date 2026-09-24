import { z } from "zod";

export const proficiencyLevels = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
] as const;

export type ProficiencyType = (typeof proficiencyLevels)[number];

export const languageFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Language name is required")
    .max(100, "Language name cannot exceed 100 characters"),
  proficiency: z.enum(proficiencyLevels),
});

export type LanguageFormData = z.infer<typeof languageFormSchema>;
