"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/ui/toast";
import { HeaderSync } from "@/components/layout/HeaderContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { TrashXIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { SkillMasteryBar } from "./SkillMasteryBar";
import { SkillsSkeleton } from "./SkillsSkeleton";
import { SkillDialog } from "./SkillDialog";
import { DeleteSkillDialog } from "./DeleteSkillDialog";
import type { SkillFormData, MasteryType } from "../schemas/skill.schema";
import {
  ProfileSkillsDocument,
  SkillCategoriesDocument,
  SkillsCatalogDocument,
  AddProfileSkillDocument,
  UpdateProfileSkillDocument,
  DeleteProfileSkillDocument,
  type Mastery,
} from "@/graphql/__generated__/graphql";

export interface SkillItem {
  name: string;
  categoryId?: string | null;
  mastery: MasteryType;
}

export interface UserSkillsViewProps {
  userId: string;
  initialProfile?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    skills: SkillItem[];
  };
  isOwner?: boolean;
}

const KNOWN_CATEGORIES: Record<string, string[]> = {
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

export function UserSkillsView({
  userId,
  initialProfile,
  isOwner: propIsOwner,
}: UserSkillsViewProps) {
  const { isOwnProfile } = useCurrentUser();
  const isOwner =
    typeof propIsOwner === "boolean" ? propIsOwner : isOwnProfile(userId);

  const { data: profileData, loading: profileLoading } = useQuery(
    ProfileSkillsDocument,
    {
      variables: { userId },
      skip: !userId,
      errorPolicy: "ignore",
    },
  );

  const { data: categoriesData } = useQuery(SkillCategoriesDocument, {
    errorPolicy: "ignore",
  });

  const { data: catalogData } = useQuery(SkillsCatalogDocument, {
    variables: { params: { limit: 100 } },
    errorPolicy: "ignore",
  });

  const [addProfileSkill] = useMutation(AddProfileSkillDocument, {
    refetchQueries: [{ query: ProfileSkillsDocument, variables: { userId } }],
  });

  const [updateProfileSkill] = useMutation(UpdateProfileSkillDocument, {
    refetchQueries: [{ query: ProfileSkillsDocument, variables: { userId } }],
  });

  const [deleteProfileSkill] = useMutation(DeleteProfileSkillDocument, {
    refetchQueries: [{ query: ProfileSkillsDocument, variables: { userId } }],
  });

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    data: SkillFormData | null;
  }>({
    isOpen: false,
    data: null,
  });

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Allow canceling selection mode with Escape key
  useEffect(() => {
    if (!isDeleteMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDeleteMode(false);
        setSelectedSkills(new Set());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleteMode]);

  const profile = profileData?.profile || initialProfile;
  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "";

  const skills: SkillItem[] = useMemo(() => {
    if (profileData?.profile?.skills) {
      return profileData.profile.skills.map((s) => ({
        name: s.name,
        categoryId: s.categoryId,
        mastery: s.mastery as MasteryType,
      }));
    }
    return initialProfile?.skills || [];
  }, [profileData, initialProfile]);

  const categoriesList = useMemo(() => {
    if (
      categoriesData?.skillCategories &&
      categoriesData.skillCategories.length > 0
    ) {
      return [...categoriesData.skillCategories].sort(
        (a, b) => a.order - b.order,
      );
    }
    return [
      { id: "cat-prog-lang", name: "Programming languages", order: 1 },
      { id: "cat-frontend", name: "Frontend", order: 2 },
      { id: "cat-backend", name: "Backend", order: 3 },
      { id: "cat-vcs", name: "Source control systems", order: 4 },
      { id: "cat-other", name: "Other", order: 99 },
    ];
  }, [categoriesData]);

  const catalogSkills = useMemo(() => {
    if (catalogData?.skills?.items) {
      return catalogData.skills.items.map((item) => ({
        name: item.name,
        categoryId: item.category?.id || null,
      }));
    }
    return [];
  }, [catalogData]);

  const groupedSkills = useMemo(() => {
    const categoryNameById = new Map<string, string>();
    categoriesList.forEach((cat) => {
      categoryNameById.set(cat.id, cat.name);
    });

    const groups = new Map<string, SkillItem[]>();

    skills.forEach((skill) => {
      let catName = skill.categoryId
        ? categoryNameById.get(skill.categoryId)
        : null;

      if (!catName) {
        for (const [knownCat, skillNames] of Object.entries(KNOWN_CATEGORIES)) {
          if (
            skillNames.some(
              (name) => name.toLowerCase() === skill.name.toLowerCase(),
            )
          ) {
            catName = knownCat;
            break;
          }
        }
      }

      const finalCat = catName || "Other";
      if (!groups.has(finalCat)) {
        groups.set(finalCat, []);
      }
      groups.get(finalCat)!.push(skill);
    });

    const orderedGroups: Array<{ categoryName: string; items: SkillItem[] }> =
      [];

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
  }, [skills, categoriesList]);

  const handleOpenAdd = () => {
    setDialogState({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEdit = (skill: SkillItem) => {
    setDialogState({
      isOpen: true,
      data: {
        name: skill.name,
        categoryId: skill.categoryId || "",
        mastery: skill.mastery,
      },
    });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, data: null });
  };

  const handleToggleSelect = (skillName: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skillName)) {
        next.delete(skillName);
      } else {
        next.add(skillName);
      }
      return next;
    });
  };

  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedSkills(new Set());
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedSkills(new Set());
  };

  const handleConfirmDelete = async () => {
    if (selectedSkills.size === 0 || isDeleting) return;
    const namesToDelete = Array.from(selectedSkills);
    try {
      setIsDeleting(true);
      await deleteProfileSkill({
        variables: {
          skill: {
            userId,
            name: namesToDelete,
          },
        },
      });
      notify.success(
        `Deleted ${namesToDelete.length} ${
          namesToDelete.length === 1 ? "skill" : "skills"
        } successfully!`,
      );
      setSelectedSkills(new Set());
      setIsDeleteMode(false);
      setIsDeleteConfirmOpen(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete skills.";
      notify.error(msg, "Error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSkill = async (formData: SkillFormData) => {
    try {
      if (dialogState.data) {
        await updateProfileSkill({
          variables: {
            skill: {
              userId,
              name: formData.name,
              categoryId: formData.categoryId || null,
              mastery: formData.mastery as Mastery,
            },
          },
        });
        notify.success(`Skill "${formData.name}" updated successfully!`);
      } else {
        await addProfileSkill({
          variables: {
            skill: {
              userId,
              name: formData.name,
              categoryId: formData.categoryId || null,
              mastery: formData.mastery as Mastery,
            },
          },
        });
        notify.success(`Skill "${formData.name}" added successfully!`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save skill.";
      notify.error(msg, "Error");
      throw err;
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    try {
      await deleteProfileSkill({
        variables: {
          skill: {
            userId,
            name: [skillName],
          },
        },
      });
      notify.success(`Skill "${skillName}" deleted successfully!`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete skill.";
      notify.error(msg, "Error");
      throw err;
    }
  };

  if (profileLoading && !initialProfile) {
    return <SkillsSkeleton />;
  }

  return (
    <div
      data-slot="user-skills-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto"
    >
      {fullName && <HeaderSync userName={fullName} />}

      {skills.length === 0 ? (
        <div
          data-slot="skills-empty-state"
          className="w-full py-16 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            No skills have been added yet.
          </p>
          {isOwner && (
            <Button
              type="button"
              onClick={handleOpenAdd}
              className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white text-xs px-5 h-9 uppercase font-medium tracking-wider cursor-pointer"
            >
              Add Your First Skill
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {groupedSkills.map(({ categoryName, items }) => (
            <section
              key={categoryName}
              data-slot="skill-category-section"
              className="space-y-4"
            >
              <h2 className="text-base font-normal text-[#2E2E2E] dark:text-zinc-100 font-roboto">
                {categoryName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {items.map((skill) => {
                  const isSelected = selectedSkills.has(skill.name);
                  return (
                    <div
                      key={skill.name}
                      data-slot="skill-item"
                      role={isDeleteMode ? "checkbox" : undefined}
                      aria-checked={isDeleteMode ? isSelected : undefined}
                      tabIndex={isDeleteMode ? 0 : undefined}
                      onClick={() => {
                        if (isDeleteMode) {
                          handleToggleSelect(skill.name);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          isDeleteMode &&
                          (e.key === " " || e.key === "Enter")
                        ) {
                          e.preventDefault();
                          handleToggleSelect(skill.name);
                        }
                      }}
                      className={cn(
                        "group relative flex items-center justify-between py-1.5 rounded-sm transition-all px-2 -mx-2",
                        isDeleteMode
                          ? cn(
                              "cursor-pointer select-none",
                              isSelected
                                ? "bg-red-50/70 dark:bg-red-950/25 ring-1 ring-[#C63031]/30"
                                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40",
                            )
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40",
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isDeleteMode && (
                          <div
                            data-slot="selection-checkbox"
                            className={cn(
                              "h-4 w-4 shrink-0 rounded-xs border transition-colors flex items-center justify-center",
                              isSelected
                                ? "bg-[#C63031] border-[#C63031] text-white"
                                : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900",
                            )}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 stroke-[3]" />
                            )}
                          </div>
                        )}
                        <SkillMasteryBar
                          mastery={skill.mastery}
                          skillName={skill.name}
                        />
                        <span
                          className={cn(
                            "text-sm font-normal font-roboto truncate transition-colors",
                            isSelected
                              ? "text-[#C63031] dark:text-[#E04B4C] font-medium"
                              : "text-zinc-800 dark:text-zinc-200",
                          )}
                        >
                          {skill.name}
                        </span>
                      </div>

                      {isOwner && !isDeleteMode && (
                        <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(skill);
                            }}
                            aria-label={`Edit ${skill.name}`}
                            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer rounded-xs"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Action buttons at bottom, aligned according to skillsOwner reference */}
          {isOwner && skills.length > 0 && (
            <div
              data-slot="skills-actions"
              className="flex items-center justify-end gap-10 mt-12 pt-4"
            >
              {!isDeleteMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer select-none"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add Skill</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEnterDeleteMode}
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#C63031] dark:text-[#E04B4C] hover:opacity-80 transition-opacity cursor-pointer select-none"
                  >
                    <TrashXIcon className="h-4 w-4" />
                    <span>Remove Skills</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancelDeleteMode}
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer select-none"
                  >
                    <span>Cancel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    disabled={selectedSkills.size === 0 || isDeleting}
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#C63031] dark:text-[#E04B4C] hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer select-none"
                  >
                    <TrashXIcon className="h-4 w-4" />
                    <span>
                      {selectedSkills.size > 0
                        ? `Delete (${selectedSkills.size})`
                        : "Delete"}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <SkillDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveSkill}
        onDelete={handleDeleteSkill}
        initialData={dialogState.data}
        categories={categoriesList}
        catalogSkills={catalogSkills}
      />

      <DeleteSkillDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        skillNames={Array.from(selectedSkills)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
