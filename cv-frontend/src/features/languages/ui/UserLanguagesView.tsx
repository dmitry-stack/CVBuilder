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

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(
    new Set(),
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Allow canceling selection mode with Escape key
  useEffect(() => {
    if (!isDeleteMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDeleteMode(false);
        setSelectedLanguages(new Set());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleteMode]);

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

  const handleToggleSelect = (languageName: string) => {
    setSelectedLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(languageName)) {
        next.delete(languageName);
      } else {
        next.add(languageName);
      }
      return next;
    });
  };

  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedLanguages(new Set());
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedLanguages(new Set());
  };

  const handleConfirmDelete = async () => {
    if (selectedLanguages.size === 0 || isDeleting) return;
    const namesToDelete = Array.from(selectedLanguages);
    try {
      setIsDeleting(true);
      await deleteProfileLanguage({
        variables: {
          language: {
            userId,
            name: namesToDelete,
          },
        },
      });
      notify.success(
        `Deleted ${namesToDelete.length} ${
          namesToDelete.length === 1 ? "language" : "languages"
        } successfully!`,
      );
      setSelectedLanguages(new Set());
      setIsDeleteMode(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete languages.";
      notify.error(msg, "Error");
    } finally {
      setIsDeleting(false);
    }
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
            {languages.map((language) => {
              const isSelected = selectedLanguages.has(language.name);
              return (
                <div
                  key={language.name}
                  data-slot="language-item"
                  role={isDeleteMode ? "checkbox" : undefined}
                  aria-checked={isDeleteMode ? isSelected : undefined}
                  tabIndex={isDeleteMode ? 0 : undefined}
                  onClick={() => {
                    if (isDeleteMode) {
                      handleToggleSelect(language.name);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (isDeleteMode && (e.key === " " || e.key === "Enter")) {
                      e.preventDefault();
                      handleToggleSelect(language.name);
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
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    )}
                    <LanguageProficiencyBar
                      proficiency={language.proficiency}
                      languageName={language.name}
                    />
                    <div className="flex items-baseline gap-1.5 truncate">
                      <span
                        className={cn(
                          "text-sm font-normal font-roboto truncate transition-colors",
                          isSelected
                            ? "text-[#C63031] dark:text-[#E04B4C] font-medium"
                            : "text-zinc-800 dark:text-zinc-200",
                        )}
                      >
                        {language.name}
                      </span>
                    </div>
                  </div>

                  {isOwner && !isDeleteMode && (
                    <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(language);
                        }}
                        aria-label={`Edit ${language.name}`}
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

          {/* Action buttons at bottom, aligned according to reference */}
          {isOwner && languages.length > 0 && (
            <div
              data-slot="languages-actions"
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
                    <span>Add Language</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEnterDeleteMode}
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#C63031] dark:text-[#E04B4C] hover:opacity-80 transition-opacity cursor-pointer select-none"
                  >
                    <TrashXIcon className="h-4 w-4" />
                    <span>Remove Languages</span>
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
                    onClick={handleConfirmDelete}
                    disabled={selectedLanguages.size === 0 || isDeleting}
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#C63031] dark:text-[#E04B4C] hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer select-none"
                  >
                    <TrashXIcon className="h-4 w-4" />
                    <span>
                      {selectedLanguages.size > 0
                        ? `Delete (${selectedLanguages.size})`
                        : "Delete"}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
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
