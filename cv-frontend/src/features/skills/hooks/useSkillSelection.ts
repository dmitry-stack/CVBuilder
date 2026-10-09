"use client";

import { useState, useEffect } from "react";
import { notify } from "@/components/ui/toast";

interface UseSkillSelectionProps {
  userId: string;
  deleteProfileSkill: (options: {
    variables: { skill: { userId: string; name: string[] } };
  }) => Promise<unknown>;
}

export function useSkillSelection({
  userId,
  deleteProfileSkill,
}: UseSkillSelectionProps) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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

  const handleToggleSelect = (skillName: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skillName)) {
        next.delete(skillName);
      } else {
        next.add(skillName);
      }
      return next;
    });
  };

  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedSkills(new Set());
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedSkills(new Set());
  };

  const handleConfirmDelete = async () => {
    if (selectedSkills.size === 0 || isDeleting) return;
    const namesToDelete = Array.from(selectedSkills);
    try {
      setIsDeleting(true);
      await deleteProfileSkill({
        variables: {
          skill: {
            userId,
            name: namesToDelete,
          },
        },
      });
      notify.success(
        `Deleted ${namesToDelete.length} ${
          namesToDelete.length === 1 ? "skill" : "skills"
        } successfully!`,
      );
      setSelectedSkills(new Set());
      setIsDeleteMode(false);
      setIsDeleteConfirmOpen(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete skills.";
      notify.error(msg, "Error");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleteMode,
    selectedSkills,
    isDeleting,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    handleToggleSelect,
    handleEnterDeleteMode,
    handleCancelDeleteMode,
    handleConfirmDelete,
  };
}
