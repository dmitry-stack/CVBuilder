import { z } from "zod";

export const cvSkillFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Skill is required" }),
});

export type CvSkillFormData = z.infer<typeof cvSkillFormSchema>;
