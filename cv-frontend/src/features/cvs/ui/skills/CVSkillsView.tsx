"use client";

import { useState } from "react";
import { HeaderSync } from "@/components/layout/HeaderContext";
import { SkillsSkeleton } from "@/features/skills/ui/SkillsSkeleton";
import { SkillDialog } from "@/features/skills/ui/SkillDialog";
import { DeleteSkillDialog } from "@/features/skills/ui/DeleteSkillDialog";
import type { SkillFormData } from "@/features/skills/schemas/skill.schema";
import { useCvSkills } from "../../hooks/useCvSkills";
import { CVSkillsList } from "./CVSkillsList";
import { CVSkillsActions } from "./CVSkillsActions";
import { CVSkillsEmptyState } from "./CVSkillsEmptyState";
import type { SkillItem } from "../../lib/cv-skills.utils";

interface CVSkillsViewProps {
  cvId: string;
}

export function CVSkillsView({ cvId }: CVSkillsViewProps) {
  const {
    cv,
    skills,
    groupedSkills,
    categoriesList,
    catalogSkills,
    isOwner,
    loading,
    isDeleteMode,
    setIsDeleteMode,
    selectedSkills,
    toggleSkillSelection,
    clearSelection,
    handleSaveSkill,
    handleDeleteSkills,
  } = useCvSkills(cvId);

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    initialData: SkillFormData | null;
  }>({
    isOpen: false,
    initialData: null,
  });

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteTargetNames, setDeleteTargetNames] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddDialog = () =>
    setDialogState({ isOpen: true, initialData: null });

  const openEditDialog = (skill: SkillItem) => {
    setDialogState({
      isOpen: true,
      initialData: {
        name: skill.name,
        categoryId: skill.categoryId || "",
        mastery: skill.mastery,
      },
    });
  };

  const closeDialog = () =>
    setDialogState({ isOpen: false, initialData: null });

  const handleSave = async (formData: SkillFormData) => {
    const isEdit = Boolean(dialogState.initialData);
    await handleSaveSkill(formData, isEdit);
    closeDialog();
  };

  const handleDeleteFromEditModal = async (name: string) => {
    closeDialog();
    setDeleteTargetNames([name]);
    setIsConfirmDeleteOpen(true);
  };

  const handleOpenBatchDeleteConfirm = () => {
    setDeleteTargetNames(Array.from(selectedSkills));
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await handleDeleteSkills(deleteTargetNames);
      setIsConfirmDeleteOpen(false);
      setDeleteTargetNames([]);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <SkillsSkeleton />;
  }

  const ownerName = cv?.user?.profile
    ? `${cv.user.profile.first_name || ""} ${cv.user.profile.last_name || ""}`.trim()
    : "";

  return (
    <div
      data-slot="cv-skills-view"
      data-testid="cv-skills-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto"
    >
      {cv?.name && <HeaderSync userName={cv?.name} />}

      {skills.length === 0 ? (
        <CVSkillsEmptyState isOwner={isOwner} onAddClick={openAddDialog} />
      ) : (
        <div className="space-y-8">
          <CVSkillsList
            groupedSkills={groupedSkills}
            isOwner={isOwner}
            isDeleteMode={isDeleteMode}
            selectedSkills={selectedSkills}
            onToggleSelect={toggleSkillSelection}
            onEditClick={openEditDialog}
          />

          {isOwner && (
            <CVSkillsActions
              isDeleteMode={isDeleteMode}
              selectedCount={selectedSkills.size}
              isDeleting={isDeleting}
              onAddClick={openAddDialog}
              onEnterDeleteMode={() => setIsDeleteMode(true)}
              onCancelDeleteMode={clearSelection}
              onConfirmDeleteClick={handleOpenBatchDeleteConfirm}
            />
          )}
        </div>
      )}

      {isOwner && (
        <>
          <SkillDialog
            isOpen={dialogState.isOpen}
            onClose={closeDialog}
            onSave={handleSave}
            onDelete={handleDeleteFromEditModal}
            initialData={dialogState.initialData}
            categories={categoriesList}
            catalogSkills={catalogSkills}
          />

          <DeleteSkillDialog
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
            skillNames={deleteTargetNames}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  );
}
