"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  skillFormSchema,
  type SkillFormData,
  type MasteryType,
} from "../schemas/skill.schema";
import type { CategoryOption } from "../ui/SkillDialogFormFields";

interface UseSkillDialogFormParams {
  isOpen: boolean;
  initialData?: SkillFormData | null;
  categories: CategoryOption[];
  catalogSkills: Array<{ name: string; categoryId?: string | null }>;
}

export function useSkillDialogForm({
  isOpen,
  initialData,
  categories,
  catalogSkills,
}: UseSkillDialogFormParams) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || categories[0]?.id || "",
      mastery: initialData?.mastery || "Novice",
    },
  });

  const selectedMastery = useWatch({
    control,
    name: "mastery",
    defaultValue: initialData?.mastery || "Novice",
  }) as MasteryType;

  const selectedCategoryId = useWatch({
    control,
    name: "categoryId",
    defaultValue: initialData?.categoryId || categories[0]?.id || "",
  });

  const currentSkillName = useWatch({
    control,
    name: "name",
    defaultValue: initialData?.name || "",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || "",
        categoryId: initialData?.categoryId || categories[0]?.id || "",
        mastery: initialData?.mastery || "Novice",
      });
    }
  }, [isOpen, initialData, categories, reset]);

  const handleSkillNameChange = (name: string) => {
    setValue("name", name, { shouldValidate: true });
    const matched = catalogSkills.find(
      (s) => s.name.toLowerCase() === name.toLowerCase(),
    );
    if (matched?.categoryId) {
      setValue("categoryId", matched.categoryId, { shouldValidate: true });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    selectedMastery,
    selectedCategoryId,
    currentSkillName,
    handleSkillNameChange,
  };
}
