import { describe, it, expect } from "vitest";
import { languageFormSchema } from "./language.schema";

describe("Language Schema Validation", () => {
  it("validates valid language and proficiency", () => {
    const validData = {
      name: "English",
      proficiency: "C1" as const,
    };

    const result = languageFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("English");
      expect(result.data.proficiency).toBe("C1");
    }
  });

  it("trims whitespace from language name", () => {
    const data = {
      name: "   German   ",
      proficiency: "B2" as const,
    };

    const result = languageFormSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("German");
    }
  });

  it("rejects empty language name", () => {
    const data = {
      name: "   ",
      proficiency: "A1" as const,
    };

    const result = languageFormSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Language name is required");
    }
  });

  it("rejects invalid proficiency level", () => {
    const data = {
      name: "Spanish",
      proficiency: "Fluent" as unknown as "Native",
    };

    const result = languageFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
