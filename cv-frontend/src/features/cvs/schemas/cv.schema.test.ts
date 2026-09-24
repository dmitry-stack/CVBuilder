import { describe, it, expect } from "vitest";
import {
  cvFormSchema,
  createCvSchema,
  updateCvSchema,
  deleteCvSchema,
} from "./cv.schema";

describe("cvFormSchema", () => {
  it("validates valid CV data successfully", () => {
    const validData = {
      name: "Senior Frontend Engineer CV",
      education: "Bachelor of Science in Computer Science",
      description: "Experienced engineer specializing in React and Next.js.",
    };

    const result = cvFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("allows omitting education or having empty string education", () => {
    const withoutEducation = {
      name: "Product Manager CV",
      description: "Proven track record in agile project leadership.",
    };

    const emptyEducation = {
      name: "Product Manager CV",
      education: "",
      description: "Proven track record in agile project leadership.",
    };

    expect(cvFormSchema.safeParse(withoutEducation).success).toBe(true);
    expect(cvFormSchema.safeParse(emptyEducation).success).toBe(true);
  });

  it("fails when name is missing or empty whitespace", () => {
    const emptyName = {
      name: "   ",
      education: "BS Software Engineering",
      description: "Valid description",
    };

    const result = cvFormSchema.safeParse(emptyName);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required");
    }
  });

  it("fails when description is missing or empty whitespace", () => {
    const emptyDesc = {
      name: "Full Stack Developer",
      education: "MS CS",
      description: "   ",
    };

    const result = cvFormSchema.safeParse(emptyDesc);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Description is required");
    }
  });

  it("validates createCvSchema allows optional userId", () => {
    const validWithUserId = {
      name: "Architect CV",
      description: "Cloud and microservices architect",
      userId: "user-123",
    };
    expect(createCvSchema.safeParse(validWithUserId).success).toBe(true);
  });

  it("validates updateCvSchema requires cvId", () => {
    const valid = {
      cvId: "cv-123",
      name: "Lead Developer",
      description: "Lead developer CV description",
    };
    expect(updateCvSchema.safeParse(valid).success).toBe(true);

    const invalid = {
      name: "Lead Developer",
      description: "Lead developer CV description",
    };
    expect(updateCvSchema.safeParse(invalid).success).toBe(false);
  });

  it("validates deleteCvSchema requires cvId", () => {
    expect(deleteCvSchema.safeParse({ cvId: "cv-123" }).success).toBe(true);
    expect(deleteCvSchema.safeParse({ cvId: "" }).success).toBe(false);
  });
});
