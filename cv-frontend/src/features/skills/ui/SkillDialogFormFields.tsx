"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SkillMasteryBar } from "./SkillMasteryBar";
import { useTranslation } from "@/i18n";
import {
  masteryLevels,
  type SkillFormData,
  type MasteryType,
} from "../schemas/skill.schema";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface SkillDialogFormFieldsProps {
  register: UseFormRegister<SkillFormData>;
  errors: FieldErrors<SkillFormData>;
  isSubmitting: boolean;
  isEdit: boolean;
  categories: CategoryOption[];
  catalogSkills: Array<{ name: string; categoryId?: string | null }>;
  selectedCategoryId: string;
  onCategoryChange: (val: string) => void;
  selectedMastery: MasteryType;
  onMasteryChange: (val: string) => void;
  currentSkillName: string;
  onSkillNameChange: (val: string) => void;
}

export function SkillDialogFormFields({
  register,
  errors,
  isSubmitting,
  isEdit,
  categories,
  catalogSkills,
  selectedCategoryId,
  onCategoryChange,
  selectedMastery,
  onMasteryChange,
  currentSkillName,
  onSkillNameChange,
}: SkillDialogFormFieldsProps) {
  const { t } = useTranslation();

  const categoryOptions = [
    { value: "", label: t("skills.selectCategory") },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const masteryOptions = masteryLevels.map((lvl) => ({
    value: lvl,
    label: lvl,
  }));

  return (
    <div className="space-y-5">
      <div>
        <Input
          id="skill_name"
          label={t("skills.skillName")}
          alwaysShowLabel
          placeholder={t("skills.skillPlaceholder")}
          disabled={isEdit || isSubmitting}
          list="catalog-skills-list"
          error={errors.name?.message}
          {...register("name")}
          onChange={(e) => onSkillNameChange(e.target.value)}
        />
        <datalist id="catalog-skills-list">
          {catalogSkills.map((s) => (
            <option key={s.name} value={s.name} />
          ))}
        </datalist>
      </div>

      <div>
        <Select
          id="skill_category"
          label={t("skills.category")}
          alwaysShowLabel
          disabled={isSubmitting}
          options={categoryOptions}
          value={selectedCategoryId}
          onChange={onCategoryChange}
          error={errors.categoryId?.message}
        />
      </div>

      <div className="space-y-2">
        <Select
          id="skill_mastery"
          label={t("skills.mastery")}
          alwaysShowLabel
          disabled={isSubmitting}
          options={masteryOptions}
          value={selectedMastery}
          onChange={onMasteryChange}
          error={errors.mastery?.message}
        />

        <div className="flex items-center gap-3 px-3 py-2 bg-zinc-100 dark:bg-zinc-800/50">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto">
            {t("common.preview")}
          </span>
          <SkillMasteryBar
            mastery={selectedMastery || "Novice"}
            skillName={currentSkillName || "Skill"}
          />
          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
            {selectedMastery || "Novice"}
          </span>
        </div>
      </div>
    </div>
  );
}
