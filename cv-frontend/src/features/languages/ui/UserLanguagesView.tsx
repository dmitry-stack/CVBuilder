"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/ui/toast";
import { HeaderSync } from "@/components/layout/HeaderContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { LanguageProficiencyBar } from "./LanguageProficiencyBar";
import { LanguagesSkeleton } from "./LanguagesSkeleton";
import { LanguageDialog } from "./LanguageDialog";
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

export interface UserLanguagesViewProps {
  userId: string;
  initialProfile?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    languages: LanguageItem[];
  };
  isOwner?: boolean;
}

export function UserLanguagesView({
  userId,
  initialProfile,
  isOwner: propIsOwner,
}: UserLanguagesViewProps) {
  const { isOwnProfile } = useCurrentUser();
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

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    data: LanguageFormData | null;
  }>({
    isOpen: false,
    data: null,
  });

  const profile = profileData?.profile || initialProfile;
  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "";

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

  const handleOpenAdd = () => {
    setDialogState({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEdit = (language: LanguageItem) => {
    setDialogState({
      isOpen: true,
      data: {
        name: language.name,
        proficiency: language.proficiency,
      },
    });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, data: null });
  };

  const handleSaveLanguage = async (formData: LanguageFormData) => {
    try {
      if (dialogState.data) {
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

  if (profileLoading && !initialProfile) {
    return <LanguagesSkeleton />;
  }

  return (
    <div
      data-slot="user-languages-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto"
    >
      {fullName && <HeaderSync userName={fullName} />}

      {isOwner && (
        <div className="flex items-center justify-end mb-6">
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white text-xs px-4 h-8 uppercase font-medium tracking-wider shadow-cv-button transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Language</span>
          </Button>
        </div>
      )}

      {languages.length === 0 ? (
        <div
          data-slot="languages-empty-state"
          className="w-full py-16 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            No languages have been added yet.
          </p>
          {isOwner && (
            <Button
              type="button"
              onClick={handleOpenAdd}
              className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white text-xs px-5 h-9 uppercase font-medium tracking-wider cursor-pointer"
            >
              Add Your First Language
            </Button>
          )}
        </div>
      ) : (
        <section data-slot="languages-section" className="space-y-4">
          <h2 className="text-base font-normal text-[#2E2E2E] dark:text-zinc-100 font-roboto">
            Languages
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {languages.map((language) => (
              <div
                key={language.name}
                data-slot="language-item"
                className="group relative flex items-center justify-between py-1 rounded-xs transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 px-1 -mx-1"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <LanguageProficiencyBar
                    proficiency={language.proficiency}
                    languageName={language.name}
                  />
                  <div className="flex items-baseline gap-1.5 truncate">
                    <span className="text-sm font-normal text-zinc-800 dark:text-zinc-200 font-roboto truncate">
                      {language.name}
                    </span>
                  </div>
                </div>

                {isOwner && (
                  <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(language)}
                      aria-label={`Edit ${language.name}`}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer rounded-xs"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLanguage(language.name)}
                      aria-label={`Delete ${language.name}`}
                      className="p-1 text-zinc-400 hover:text-destructive transition-colors cursor-pointer rounded-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <LanguageDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveLanguage}
        onDelete={handleDeleteLanguage}
        initialData={dialogState.data}
        catalogLanguages={catalogLanguages}
      />
    </div>
  );
}
