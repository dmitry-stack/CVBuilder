"use client";

import { useState } from "react";
import { HeaderSync } from "@/shared/components/layout/HeaderContext";
import { SkillsSkeleton } from "./SkillsSkeleton";
import { useDelayedLoading } from "@/shared/lib/hooks/useDelayedLoading";
import { SkillDialog } from "./SkillDialog";
import { DeleteSkillDialog } from "./DeleteSkillDialog";
import { SkillCategorySection } from "./SkillCategorySection";
import { SkillsActionBar } from "./SkillsActionBar";
import {
  useUserSkills,
  type SkillItem,
  type UseUserSkillsProps,
} from "../hooks/useUserSkills";
import { useSkillSelection } from "../hooks/useSkillSelection";
import { useTranslation } from "@/i18n";
import type { SkillFormData } from "../schemas/skill.schema";

export type { SkillItem };
export type UserSkillsViewProps = UseUserSkillsProps;

export function UserSkillsView(props: UserSkillsViewProps = {}) {
  const { t } = useTranslation();
  const {
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
  } = useUserSkills(props);

  const {
    isDeleteMode,
    selectedSkills,
    isDeleting,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    handleToggleSelect,
    handleEnterDeleteMode,
    handleCancelDeleteMode,
    handleConfirmDelete,
  } = useSkillSelection({
    userId,
    deleteProfileSkill,
  });

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    data: SkillFormData | null;
  }>({
    isOpen: false,
    data: null,
  });

  const handleOpenAdd = () => {
    setDialogState({ isOpen: true, data: null });
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

  const onSave = async (formData: SkillFormData) => {
    await handleSaveSkill(formData, Boolean(dialogState.data));
  };

  const isInitialLoading = Boolean(
    (!userId && !props.initialProfile) ||
      (profileLoading && !props.initialProfile && !skills.length),
  );
  const showSkeleton = useDelayedLoading(isInitialLoading);

  if (showSkeleton) {
    return <SkillsSkeleton />;
  }

  if (isInitialLoading) {
    return null;
  }

  return (
    <div
      data-slot="user-skills-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto"
    >
      {(!profileLoading || props.initialProfile) && userId && (
        <HeaderSync userName={fullName} entityId={userId} />
      )}

      {skills.length === 0 ? (
        <div
          data-slot="skills-empty-state"
          className="w-full py-16 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800"
        >
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("skills.noSkills")}
          </span>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedSkills.map(({ categoryName, items }) => (
            <SkillCategorySection
              key={categoryName}
              categoryName={categoryName}
              items={items}
              isOwner={isOwner}
              isDeleteMode={isDeleteMode}
              selectedSkills={selectedSkills}
              onToggleSelect={handleToggleSelect}
              onOpenEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      <SkillsActionBar
        isOwner={isOwner}
        isDeleteMode={isDeleteMode}
        hasSkills={skills.length > 0}
        selectedCount={selectedSkills.size}
        isDeleting={isDeleting}
        onOpenAdd={handleOpenAdd}
        onEnterDeleteMode={handleEnterDeleteMode}
        onCancelDeleteMode={handleCancelDeleteMode}
        onRequestDeleteConfirm={() => setIsDeleteConfirmOpen(true)}
      />

      <SkillDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onSave={onSave}
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
