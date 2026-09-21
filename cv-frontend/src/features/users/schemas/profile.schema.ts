import { z } from "zod";

export const profileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be under 50 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  role: z.enum(["Employee", "Admin"]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
