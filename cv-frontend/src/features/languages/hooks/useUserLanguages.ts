"use client";

import { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { notify } from "@/components/ui/toast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type {
  LanguageFormData,
  ProficiencyType,
} from "../schemas/language.schema";
import {
  ProfileLanguagesDocument,
  LanguagesCatalogDocument,
  AddProfileLanguageDocument,
  UpdateProfileLanguageDocument,
  DeleteProfileLanguageDocument,
  type ProfileLanguagesQuery,
  type LanguagesCatalogQuery,
  type Proficiency,
} from "@/graphql/__generated__/graphql";

export interface LanguageItem {
  name: string;
  proficiency: ProficiencyType;
}

export interface UseUserLanguagesProps {
  userId: string;
  initialProfile?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    languages: LanguageItem[];
  };
  isOwner?: boolean;
}

export function useUserLanguages({
  userId,
  initialProfile,
  isOwner: propIsOwner,
}: UseUserLanguagesProps) {
  const { isOwnProfile, currentUser } = useCurrentUser();
  const isOwner =
    typeof propIsOwner === "boolean" ? propIsOwner : isOwnProfile(userId);

  const { data: profileData, loading: profileLoading } =
    useQuery<ProfileLanguagesQuery>(ProfileLanguagesDocument, {
      variables: { userId },
      skip: !userId,
      errorPolicy: "ignore",
    });

  const { data: catalogData } = useQuery<LanguagesCatalogQuery>(
    LanguagesCatalogDocument,
    {
      variables: { params: { limit: 100 } },
      errorPolicy: "ignore",
    },
  );

  const [addProfileLanguage] = useMutation(AddProfileLanguageDocument, {
    refetchQueries: [
      { query: ProfileLanguagesDocument, variables: { userId } },
    ],
  });

  const [updateProfileLanguage] = useMutation(UpdateProfileLanguageDocument, {
    refetchQueries: [
      { query: ProfileLanguagesDocument, variables: { userId } },
    ],
  });

  const [deleteProfileLanguage] = useMutation(DeleteProfileLanguageDocument, {
    refetchQueries: [
      { query: ProfileLanguagesDocument, variables: { userId } },
    ],
  });

  const profile = profileData?.profile || initialProfile;
  const fullName =
    (profile
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
        (profile as { email?: string | null })?.email ||
        ""
      : "") || (isOwner ? currentUser?.email || "" : "");

  const languages: LanguageItem[] = useMemo(() => {
    if (profileData?.profile?.languages) {
      return profileData.profile.languages.map((l) => ({
        name: l.name,
        proficiency: l.proficiency as ProficiencyType,
      }));
    }
    return initialProfile?.languages || [];
  }, [profileData, initialProfile]);

  const catalogLanguages = useMemo(() => {
    if (catalogData?.languages?.items) {
      return catalogData.languages.items.map((item) => ({
        name: item.name,
        native_name: item.native_name,
      }));
    }
    return [];
  }, [catalogData]);

  const handleSaveLanguage = async (
    formData: LanguageFormData,
    isEdit: boolean,
  ) => {
    try {
      if (isEdit) {
        await updateProfileLanguage({
          variables: {
            language: {
              userId,
              name: formData.name,
              proficiency: formData.proficiency as Proficiency,
            },
          },
        });
        notify.success(`Language "${formData.name}" updated successfully!`);
      } else {
        await addProfileLanguage({
          variables: {
            language: {
              userId,
              name: formData.name,
              proficiency: formData.proficiency as Proficiency,
            },
          },
        });
        notify.success(`Language "${formData.name}" added successfully!`);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save language.";
      notify.error(msg, "Error");
      throw err;
    }
  };

  const handleDeleteLanguage = async (languageName: string) => {
    try {
      await deleteProfileLanguage({
        variables: {
          language: {
            userId,
            name: [languageName],
          },
        },
      });
      notify.success(`Language "${languageName}" deleted successfully!`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete language.";
      notify.error(msg, "Error");
      throw err;
    }
  };

  return {
    isOwner,
    profileLoading,
    fullName,
    languages,
    catalogLanguages,
    deleteProfileLanguage,
    handleSaveLanguage,
    handleDeleteLanguage,
  };
}
