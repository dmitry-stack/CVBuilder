"use client";

import { useState } from "react";
import { HeaderSync } from "@/components/layout/HeaderContext";
import { SkillsSkeleton } from "@/features/skills/ui/SkillsSkeleton";
import { useCvSkills } from "../../hooks/useCvSkills";
import { CVSkillsList } from "./CVSkillsList";
import { CVSkillsActions } from "./CVSkillsActions";
import { CVSkillsEmptyState } from "./CVSkillsEmptyState";
import { CVSkillDialog } from "./CVSkillDialog";
import { CVRemoveSkillsDialog } from "./CVRemoveSkillsDialog";
import type { SkillItem } from "../../lib/cv-skills.utils";

interface CVSkillsViewProps {
  cvId: string;
}

export function CVSkillsView({ cvId }: CVSkillsViewProps) {
  const {
    cv,
    skills,
    groupedSkills,
    availableSkills,
    isOwner,
    loading,
    isDeleteMode,
    setIsDeleteMode,
    selectedSkills,
    toggleSkillSelection,
    clearSelection,
    handleAddSkill,
    handleUpdateSkill,
    handleRemoveSkills,
  } = useCvSkills(cvId);

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    initialData: { name: string } | null;
  }>({
    isOpen: false,
    initialData: null,
  });

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteTargetNames, setDeleteTargetNames] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openAddDialog = () =>
    setDialogState({ isOpen: true, initialData: null });

  const openEditDialog = (skill: SkillItem) => {
    setDialogState({
      isOpen: true,
      initialData: { name: skill.name },
    });
  };

  const closeDialog = () =>
    setDialogState({ isOpen: false, initialData: null });

  const handleSave = async (skillName: string) => {
    try {
      setIsSaving(true);
      if (dialogState.initialData) {
        await handleUpdateSkill(dialogState.initialData.name, skillName);
      } else {
        await handleAddSkill(skillName);
      }
      closeDialog();
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenBatchDeleteConfirm = () => {
    setDeleteTargetNames(Array.from(selectedSkills));
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await handleRemoveSkills(deleteTargetNames);
      setIsConfirmDeleteOpen(false);
      setDeleteTargetNames([]);
      setIsDeleteMode(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <SkillsSkeleton />;
  }

  return (
    <div
      data-slot="cv-skills-view"
      data-testid="cv-skills-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto"
    >
      <HeaderSync userName={cv?.name} entityId={cvId} />

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
          <CVSkillDialog
            isOpen={dialogState.isOpen}
            onClose={closeDialog}
            onSave={handleSave}
            initialData={dialogState.initialData}
            availableSkills={availableSkills}
            isSubmitting={isSaving}
          />

          <CVRemoveSkillsDialog
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
