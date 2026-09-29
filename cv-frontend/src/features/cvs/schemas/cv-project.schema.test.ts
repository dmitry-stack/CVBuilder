import { describe, it, expect } from "vitest";
import { cvProjectFormSchema } from "./cv-project.schema";

describe("cvProjectFormSchema", () => {
  it("validates valid project form data", () => {
    const validData = {
      projectId: "5",
      start_date: "2023-08-21",
      end_date: null,
      roles: ["Fullstack Engineer"],
      responsibilities: ["Managed to write code in time"],
    };

    const result = cvProjectFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates project form data with description and environment tags", () => {
    const validData = {
      projectId: "3",
      start_date: "2023-01-20",
      end_date: "2023-06-19",
      description: "A system for setting up business process automation.",
      environment: ["HTML5", "CSS3", "TypeScript", "React"],
      roles: ["Frontend Developer", "AI Developer"],
      responsibilities: ["Did something great", "Did not break production"],
    };

    const result = cvProjectFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when projectId is missing or empty", () => {
    const invalidData = {
      projectId: "",
      start_date: "2023-08-21",
    };

    const result = cvProjectFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Project is required");
    }
  });

  it("fails when start_date is missing or empty", () => {
    const invalidData = {
      projectId: "5",
      start_date: "",
    };

    const result = cvProjectFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Start date is required");
    }
  });

  it("fails when end_date is before start_date", () => {
    const invalidData = {
      projectId: "5",
      start_date: "2023-08-21",
      end_date: "2022-01-01",
      roles: [],
      responsibilities: [],
    };

    const result = cvProjectFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "End date must be on or after start date",
      );
    }
  });
});
