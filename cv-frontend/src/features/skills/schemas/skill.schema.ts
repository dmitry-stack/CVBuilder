import { z } from "zod";

export const masteryLevels = [
  "Novice",
  "Advanced",
  "Competent",
  "Proficient",
  "Expert",
] as const;

export type MasteryType = (typeof masteryLevels)[number];

export const skillFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Skill name is required")
    .max(100, "Skill name cannot exceed 100 characters"),
  categoryId: z.string().optional().nullable(),
  mastery: z.enum(masteryLevels),
});

export type SkillFormData = z.infer<typeof skillFormSchema>;
