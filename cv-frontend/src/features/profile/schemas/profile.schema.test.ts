import { describe, it, expect } from "vitest";
import { profileSchema } from "../schemas/profile.schema";

describe("profileSchema", () => {
  const validData = {
    first_name: "Rostislav",
    last_name: "Harlanov",
    email: "thorn_pear@icloud.com",
    department: "React",
    position: "Software Engineer",
    role: "Employee" as const,
  };

  it("validates correct profile data", () => {
    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when first name is empty", () => {
    const result = profileSchema.safeParse({
      ...validData,
      first_name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("First name is required");
    }
  });

  it("fails when last name is empty", () => {
    const result = profileSchema.safeParse({
      ...validData,
      last_name: "   ",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Last name is required");
    }
  });

  it("fails on invalid email format", () => {
    const result = profileSchema.safeParse({
      ...validData,
      email: "invalid-email",
    });
    expect(result.success).toBe(false);
  });

  it("fails on invalid role", () => {
    const result = profileSchema.safeParse({
      ...validData,
      role: "SuperAdmin" as unknown as "Employee",
    });
    expect(result.success).toBe(false);
  });
});
