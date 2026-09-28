import type { MasteryType } from "@/features/skills/schemas/skill.schema";

export interface SkillItem {
  name: string;
  categoryId?: string | null;
  mastery: MasteryType;
}

export interface CategoryOption {
  id: string;
  name: string;
  order?: number;
}

export interface GroupedSkillCategory {
  categoryName: string;
  items: SkillItem[];
}

export const KNOWN_CATEGORIES: Record<string, string[]> = {
  "Programming languages": [
    "TypeScript",
    "JavaScript",
    "Python",
    "Java",
    "C#",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "C++",
    "C",
  ],
  Frontend: [
    "React",
    "CSS3",
    "SCSS",
    "Storybook",
    "React Query",
    "Redux",
    "Next.js",
    "Vue.js",
    "Angular",
    "HTML5",
    "Tailwind CSS",
    "Webpack",
    "Vite",
  ],
  Backend: [
    "Keycloak",
    "Node.js",
    "NestJS",
    "Express",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "GraphQL",
    "Docker",
    "Kubernetes",
    "AWS",
  ],
  "Source control systems": ["Git", "GitHub", "GitLab", "Bitbucket", "SVN"],
};

export function resolveCategoryName(
  skill: SkillItem,
  categoryMap: Map<string, string>,
): string {
  if (skill.categoryId && categoryMap.has(skill.categoryId)) {
    return categoryMap.get(skill.categoryId)!;
  }

  for (const [category, skillNames] of Object.entries(KNOWN_CATEGORIES)) {
    if (skillNames.some((n) => n.toLowerCase() === skill.name.toLowerCase())) {
      return category;
    }
  }

  return "Other";
}

export function groupSkillsByCategory(
  skills: SkillItem[],
  categoriesList: CategoryOption[],
): GroupedSkillCategory[] {
  const categoryMap = new Map<string, string>(
    categoriesList.map((cat) => [cat.id, cat.name]),
  );

  const groups = new Map<string, SkillItem[]>();

  skills.forEach((skill) => {
    const category = resolveCategoryName(skill, categoryMap);
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(skill);
  });

  const orderedGroups: GroupedSkillCategory[] = [];

  categoriesList.forEach((cat) => {
    if (groups.has(cat.name)) {
      orderedGroups.push({
        categoryName: cat.name,
        items: groups.get(cat.name)!,
      });
      groups.delete(cat.name);
    }
  });

  groups.forEach((items, categoryName) => {
    orderedGroups.push({ categoryName, items });
  });

  return orderedGroups;
}
