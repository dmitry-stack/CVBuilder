"use client";

import { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { notify } from "@/shared/components/ui/toast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { SkillFormData, MasteryType } from "../schemas/skill.schema";
import {
  KNOWN_CATEGORIES,
  DEFAULT_SKILL_CATEGORIES,
} from "../constants/skills.constants";
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

export interface UseUserSkillsProps {
  userId?: string;
  initialProfile?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    skills: SkillItem[];
  };
  isOwner?: boolean;
}

export function useUserSkills({
  userId: propUserId,
  initialProfile,
  isOwner: propIsOwner,
}: UseUserSkillsProps = {}) {
  const { isOwnProfile, currentUser } = useCurrentUser();
  const userId = propUserId || (currentUser?.id ? String(currentUser.id) : "");
  const isOwner =
    typeof propIsOwner === "boolean"
      ? propIsOwner
      : Boolean(userId && isOwnProfile(userId));

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

  const profile = profileData?.profile || initialProfile;
  const fullName =
    (profile
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
        (profile as { email?: string | null })?.email ||
        ""
      : "") || (isOwner ? currentUser?.email || "" : "");

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
    return DEFAULT_SKILL_CATEGORIES;
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

  const handleSaveSkill = async (
    formData: SkillFormData,
    isEdit: boolean,
  ) => {
    try {
      if (isEdit) {
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

  return {
    userId,
    isOwner,
    profileLoading,
    fullName,
    skills,
    categoriesList,
    catalogSkills,
    groupedSkills,
    deleteProfileSkill,
    handleSaveSkill,
    handleDeleteSkill,
  };
}
