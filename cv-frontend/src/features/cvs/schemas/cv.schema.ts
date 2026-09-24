import { z } from "zod";

export const cvFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  education: z
    .string()
    .trim()
    .max(150, "Education cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description cannot exceed 2000 characters"),
});

export type CvFormData = z.infer<typeof cvFormSchema>;

export const createCvSchema = cvFormSchema.extend({
  userId: z.string().optional(),
});
export type CreateCvFormData = z.infer<typeof createCvSchema>;

export const updateCvSchema = cvFormSchema.extend({
  cvId: z.string().min(1, "CV ID is required"),
});
export type UpdateCvFormData = z.infer<typeof updateCvSchema>;

export const deleteCvSchema = z.object({
  cvId: z.string().min(1, "CV ID is required"),
});
export type DeleteCvFormData = z.infer<typeof deleteCvSchema>;
