"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { notify } from "@/components/ui/toast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  CvSkillsDocument,
  AddCvSkillDocument,
  UpdateCvSkillDocument,
  DeleteCvSkillDocument,
  SkillCategoriesDocument,
  SkillsCatalogDocument,
  type Mastery,
} from "@/graphql/__generated__/graphql";
import type {
  SkillFormData,
  MasteryType,
} from "@/features/skills/schemas/skill.schema";
import {
  groupSkillsByCategory,
  type SkillItem,
  type CategoryOption,
} from "../lib/cv-skills.utils";

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "cat-prog-lang", name: "Programming languages", order: 1 },
  { id: "cat-frontend", name: "Frontend", order: 2 },
  { id: "cat-backend", name: "Backend", order: 3 },
  { id: "cat-vcs", name: "Source control systems", order: 4 },
  { id: "cat-other", name: "Other", order: 99 },
];

export function useCvSkills(cvId: string) {
  const { currentUser } = useCurrentUser();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());

  const { data, loading, error, refetch } = useQuery(CvSkillsDocument, {
    variables: { cvId },
    skip: !cvId,
    errorPolicy: "all",
  });

  const { data: categoriesData } = useQuery(SkillCategoriesDocument, {
    errorPolicy: "ignore",
  });

  const { data: catalogData } = useQuery(SkillsCatalogDocument, {
    variables: { params: { limit: 100 } },
    errorPolicy: "ignore",
  });

  const refetchConfig = [{ query: CvSkillsDocument, variables: { cvId } }];
  const [addSkill] = useMutation(AddCvSkillDocument, {
    refetchQueries: refetchConfig,
  });
  const [updateSkill] = useMutation(UpdateCvSkillDocument, {
    refetchQueries: refetchConfig,
  });
  const [deleteSkill] = useMutation(DeleteCvSkillDocument, {
    refetchQueries: refetchConfig,
  });

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

  const toggleSkillSelection = useCallback((name: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSkills(new Set());
    setIsDeleteMode(false);
  }, []);

  const cv = data?.cv;
  const isOwner = Boolean(
    currentUser?.id &&
    cv?.user?.id &&
    String(currentUser.id) === String(cv.user.id),
  );
  const isAdmin = currentUser?.role === "Admin";
  const canEdit = isOwner || isAdmin;

  const skills: SkillItem[] = useMemo(() => {
    const list = cv?.skills || [];
    return list.map((s) => ({
      name: s.name,
      categoryId: s.categoryId,
      mastery: s.mastery as MasteryType,
    }));
  }, [cv]);

  const ownerProfileSkills: SkillItem[] = useMemo(() => {
    const list = cv?.user?.profile?.skills || [];
    return list.map((s) => ({
      name: s.name,
      categoryId: s.categoryId,
      mastery: s.mastery as MasteryType,
    }));
  }, [cv]);

  const availableSkills: SkillItem[] = useMemo(() => {
    const currentNames = new Set(skills.map((s) => s.name));
    return ownerProfileSkills.filter((s) => !currentNames.has(s.name));
  }, [ownerProfileSkills, skills]);

  const categoriesList = useMemo(() => {
    if (
      categoriesData?.skillCategories &&
      categoriesData.skillCategories.length > 0
    ) {
      return [...categoriesData.skillCategories].sort(
        (a, b) => a.order - b.order,
      );
    }
    return DEFAULT_CATEGORIES;
  }, [categoriesData]);

  const catalogSkills = useMemo(() => {
    return (catalogData?.skills?.items || []).map((item) => ({
      name: item.name,
      categoryId: item.category?.id || null,
    }));
  }, [catalogData]);

  const groupedSkills = useMemo(() => {
    return groupSkillsByCategory(skills, categoriesList);
  }, [skills, categoriesList]);

  const handleAddSkill = async (skillName: string) => {
    const target = ownerProfileSkills.find((s) => s.name === skillName);
    if (!target) {
      notify.error("Skill not found in profile");
      return;
    }
    try {
      await addSkill({
        variables: {
          skill: {
            cvId,
            name: target.name,
            categoryId: target.categoryId || null,
            mastery: target.mastery as Mastery,
          },
        },
      });
      notify.success("Skill added successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add skill";
      notify.error(msg);
      throw err;
    }
  };

  const handleUpdateSkill = async (
    oldSkillName: string,
    newSkillName: string,
  ) => {
    if (oldSkillName === newSkillName) return;
    const target = ownerProfileSkills.find((s) => s.name === newSkillName);
    if (!target) {
      notify.error("Skill not found in profile");
      return;
    }
    try {
      await deleteSkill({
        variables: { skill: { cvId, name: [oldSkillName] } },
      });
      await addSkill({
        variables: {
          skill: {
            cvId,
            name: target.name,
            categoryId: target.categoryId || null,
            mastery: target.mastery as Mastery,
          },
        },
      });
      notify.success("Skill updated successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update skill";
      notify.error(msg);
      throw err;
    }
  };

  const handleRemoveSkills = async (names: string[]) => {
    if (names.length === 0) return;
    try {
      await deleteSkill({ variables: { skill: { cvId, name: names } } });
      clearSelection();
      notify.success(
        names.length === 1 ? "Skill removed" : `${names.length} skills removed`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove skill";
      notify.error(msg);
      throw err;
    }
  };

  // Backward compatibility alias for any existing code
  const handleSaveSkill = async (formData: SkillFormData, isEdit: boolean) => {
    try {
      if (isEdit) {
        await updateSkill({
          variables: {
            skill: {
              cvId,
              name: formData.name,
              categoryId: formData.categoryId || null,
              mastery: formData.mastery as Mastery,
            },
          },
        });
        notify.success("Skill updated successfully");
      } else {
        await addSkill({
          variables: {
            skill: {
              cvId,
              name: formData.name,
              categoryId: formData.categoryId || null,
              mastery: formData.mastery as Mastery,
            },
          },
        });
        notify.success("Skill added successfully");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save skill";
      notify.error(msg);
      throw err;
    }
  };

  return {
    cv,
    skills,
    ownerProfileSkills,
    availableSkills,
    groupedSkills,
    categoriesList,
    catalogSkills,
    isOwner: canEdit,
    canEdit,
    loading,
    error,
    refetch,
    isDeleteMode,
    setIsDeleteMode,
    selectedSkills,
    toggleSkillSelection,
    clearSelection,
    handleAddSkill,
    handleUpdateSkill,
    handleRemoveSkills,
    handleSaveSkill,
    handleDeleteSkills: handleRemoveSkills,
  };
}
