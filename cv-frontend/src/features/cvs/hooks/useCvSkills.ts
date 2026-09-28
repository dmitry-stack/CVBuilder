"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
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
  const initializedCvIds = useRef<Set<string>>(new Set());

  const { data, loading, error } = useQuery(CvSkillsDocument, {
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

  const skills: SkillItem[] = useMemo(() => {
    const list =
      cv?.skills && cv.skills.length > 0
        ? cv.skills
        : cv?.user?.profile?.skills || [];
    return list.map((s) => ({
      name: s.name,
      categoryId: s.categoryId,
      mastery: s.mastery as MasteryType,
    }));
  }, [cv]);

  useEffect(() => {
    if (!isOwner || loading || !cv?.id) return;
    if (initializedCvIds.current.has(cv.id)) return;

    const profileSkills = cv.user?.profile?.skills || [];
    const cvSkills = cv.skills || [];

    if (cvSkills.length === 0 && profileSkills.length > 0) {
      initializedCvIds.current.add(cv.id);
      profileSkills.forEach(async (skill) => {
        try {
          await addSkill({
            variables: {
              skill: {
                cvId,
                name: skill.name,
                categoryId: skill.categoryId || null,
                mastery: skill.mastery as Mastery,
              },
            },
          });
        } catch {
          // ignore if already added or race condition
        }
      });
    }
  }, [cv, isOwner, loading, cvId, addSkill]);

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

  const handleDeleteSkills = async (names: string[]) => {
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

  return {
    cv,
    skills,
    groupedSkills,
    categoriesList,
    catalogSkills,
    isOwner,
    loading,
    error,
    isDeleteMode,
    setIsDeleteMode,
    selectedSkills,
    toggleSkillSelection,
    clearSelection,
    handleSaveSkill,
    handleDeleteSkills,
  };
}
