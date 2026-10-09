"use client";

import { useState } from "react";
import { HeaderSync } from "@/shared/components/layout/HeaderContext";
import { LanguagesSkeleton } from "./LanguagesSkeleton";
import { useDelayedLoading } from "@/shared/lib/hooks/useDelayedLoading";
import { LanguageDialog } from "./LanguageDialog";
import { DeleteLanguageDialog } from "./DeleteLanguageDialog";
import { LanguageListItem } from "./LanguageListItem";
import { LanguagesActionBar } from "./LanguagesActionBar";
import {
  useUserLanguages,
  type LanguageItem,
  type UseUserLanguagesProps,
} from "../hooks/useUserLanguages";
import { useLanguageSelection } from "../hooks/useLanguageSelection";
import { useTranslation } from "@/i18n";
import type { LanguageFormData } from "../schemas/language.schema";

export type { LanguageItem };
export type UserLanguagesViewProps = UseUserLanguagesProps;

export function UserLanguagesView(props: UserLanguagesViewProps) {
  const { t } = useTranslation();
  const {
    isOwner,
    profileLoading,
    fullName,
    languages,
    catalogLanguages,
    deleteProfileLanguage,
    handleSaveLanguage,
    handleDeleteLanguage,
  } = useUserLanguages(props);

  const {
    isDeleteMode,
    selectedLanguages,
    isDeleting,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    handleToggleSelect,
    handleEnterDeleteMode,
    handleCancelDeleteMode,
    handleConfirmDelete,
  } = useLanguageSelection({
    userId: props.userId,
    deleteProfileLanguage,
  });

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    data: LanguageFormData | null;
  }>({
    isOpen: false,
    data: null,
  });

  const handleOpenAdd = () => {
    setDialogState({ isOpen: true, data: null });
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

  const onSave = async (formData: LanguageFormData) => {
    await handleSaveLanguage(formData, Boolean(dialogState.data));
  };

  const isInitialLoading = Boolean(profileLoading && !props.initialProfile);
  const showSkeleton = useDelayedLoading(isInitialLoading);

  if (showSkeleton) {
    return <LanguagesSkeleton />;
  }

  if (isInitialLoading) {
    return null;
  }

  return (
    <div
      data-slot="user-languages-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto"
    >
      {(!profileLoading || props.initialProfile) && (
        <HeaderSync userName={fullName} entityId={props.userId} />
      )}

      {languages.length === 0 ? (
        <div
          data-slot="languages-empty-state"
          className="w-full py-16 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800"
        >
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("languages.noLanguages")}
          </span>
        </div>
      ) : (
        <section data-slot="languages-section" className="space-y-4">
          <h2 className="text-base font-normal text-[#2E2E2E] dark:text-zinc-100 font-roboto">
            {t("header.languages")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {languages.map((language) => (
              <LanguageListItem
                key={language.name}
                language={language}
                isOwner={isOwner}
                isDeleteMode={isDeleteMode}
                isSelected={selectedLanguages.has(language.name)}
                onToggleSelect={handleToggleSelect}
                onOpenEdit={handleOpenEdit}
              />
            ))}
          </div>
        </section>
      )}

      <LanguagesActionBar
        isOwner={isOwner}
        isDeleteMode={isDeleteMode}
        hasLanguages={languages.length > 0}
        selectedCount={selectedLanguages.size}
        isDeleting={isDeleting}
        onOpenAdd={handleOpenAdd}
        onEnterDeleteMode={handleEnterDeleteMode}
        onCancelDeleteMode={handleCancelDeleteMode}
        onRequestDeleteConfirm={() => setIsDeleteConfirmOpen(true)}
      />

      <LanguageDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onSave={onSave}
        onDelete={handleDeleteLanguage}
        initialData={dialogState.data}
        catalogLanguages={catalogLanguages}
      />

      <DeleteLanguageDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        languageNames={Array.from(selectedLanguages)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
