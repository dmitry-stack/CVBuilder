import { z } from "zod";

export const cvProjectFormSchema = z
  .object({
    projectId: z.string().min(1, "Project is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().nullable(),
    roles: z.array(z.string()).optional(),
    responsibilities: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (!data.end_date || !data.start_date) return true;
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    },
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    },
  );

export type CvProjectFormData = z.infer<typeof cvProjectFormSchema>;
