import { describe, it, expect } from "vitest";
import { cvSkillFormSchema } from "./cv-skill.schema";

describe("cvSkillFormSchema", () => {
  it("validates successfully with a valid skill name", () => {
    const result = cvSkillFormSchema.safeParse({ name: "TypeScript" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("TypeScript");
    }
  });

  it("fails validation when name is empty", () => {
    const result = cvSkillFormSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Skill is required");
    }
  });

  it("fails validation when name contains only whitespace", () => {
    const result = cvSkillFormSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Skill is required");
    }
  });
});
