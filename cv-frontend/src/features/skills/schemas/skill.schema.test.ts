import { describe, it, expect } from "vitest";
import { skillFormSchema } from "./skill.schema";

describe("Skill Schema Validation", () => {
  it("validates valid skill data", () => {
    const validData = {
      name: "TypeScript",
      categoryId: "cat-1",
      mastery: "Proficient" as const,
    };

    const result = skillFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("TypeScript");
      expect(result.data.mastery).toBe("Proficient");
    }
  });

  it("trims skill name whitespace", () => {
    const data = {
      name: "   React.js   ",
      categoryId: null,
      mastery: "Expert" as const,
    };

    const result = skillFormSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("React.js");
    }
  });

  it("rejects empty skill name", () => {
    const data = {
      name: "   ",
      categoryId: "cat-1",
      mastery: "Novice" as const,
    };

    const result = skillFormSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Skill name is required");
    }
  });

  it("rejects invalid mastery level", () => {
    const data = {
      name: "Python",
      categoryId: "cat-1",
      mastery: "Grandmaster" as unknown as "Novice",
    };

    const result = skillFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts null or optional categoryId", () => {
    const data = {
      name: "Docker",
      mastery: "Competent" as const,
    };

    const result = skillFormSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
