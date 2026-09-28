import { describe, it, expect } from "vitest";
import {
  groupSkillsByCategory,
  resolveCategoryName,
  type SkillItem,
  type CategoryOption,
} from "./cv-skills.utils";

describe("cv-skills.utils", () => {
  const mockCategories: CategoryOption[] = [
    { id: "1", name: "Programming languages", order: 1 },
    { id: "2", name: "Frontend", order: 2 },
    { id: "3", name: "Backend", order: 3 },
  ];

  describe("resolveCategoryName", () => {
    const categoryMap = new Map([
      ["1", "Programming languages"],
      ["2", "Frontend"],
    ]);

    it("resolves category by categoryId when present in map", () => {
      const skill: SkillItem = {
        name: "CustomSkill",
        categoryId: "1",
        mastery: "Expert",
      };
      expect(resolveCategoryName(skill, categoryMap)).toBe(
        "Programming languages",
      );
    });

    it("resolves category by known name when categoryId is absent or unknown", () => {
      const skill: SkillItem = {
        name: "React",
        categoryId: null,
        mastery: "Proficient",
      };
      expect(resolveCategoryName(skill, categoryMap)).toBe("Frontend");
    });

    it("falls back to 'Other' when skill is not in map or known dictionary", () => {
      const skill: SkillItem = {
        name: "UnknownTech",
        categoryId: null,
        mastery: "Novice",
      };
      expect(resolveCategoryName(skill, categoryMap)).toBe("Other");
    });
  });

  describe("groupSkillsByCategory", () => {
    it("groups skills in category order and appends remaining groups", () => {
      const skills: SkillItem[] = [
        { name: "TypeScript", categoryId: "1", mastery: "Expert" },
        { name: "React", categoryId: "2", mastery: "Proficient" },
        { name: "Python", categoryId: "1", mastery: "Competent" },
        { name: "Figma", categoryId: null, mastery: "Advanced" },
      ];

      const groups = groupSkillsByCategory(skills, mockCategories);

      expect(groups).toHaveLength(3);
      expect(groups[0].categoryName).toBe("Programming languages");
      expect(groups[0].items).toHaveLength(2);
      expect(groups[1].categoryName).toBe("Frontend");
      expect(groups[1].items).toHaveLength(1);
      expect(groups[2].categoryName).toBe("Other");
      expect(groups[2].items[0].name).toBe("Figma");
    });

    it("returns empty array when given empty skills list", () => {
      const groups = groupSkillsByCategory([], mockCategories);
      expect(groups).toEqual([]);
    });
  });
});
