"use client";

import { useState, useEffect } from "react";
import { notify } from "@/shared/components/ui/toast";

interface UseLanguageSelectionProps {
  userId: string;
  deleteProfileLanguage: (options: {
    variables: { language: { userId: string; name: string[] } };
  }) => Promise<unknown>;
}

export function useLanguageSelection({
  userId,
  deleteProfileLanguage,
}: UseLanguageSelectionProps) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(
    new Set(),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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

  const handleToggleSelect = (langName: string) => {
    setSelectedLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(langName)) {
        next.delete(langName);
      } else {
        next.add(langName);
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
      setIsDeleteConfirmOpen(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete languages.";
      notify.error(msg, "Error");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleteMode,
    selectedLanguages,
    isDeleting,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    handleToggleSelect,
    handleEnterDeleteMode,
    handleCancelDeleteMode,
    handleConfirmDelete,
  };
}
