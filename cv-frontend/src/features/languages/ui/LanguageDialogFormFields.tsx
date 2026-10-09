"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Select } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { LanguageProficiencyBar } from "./LanguageProficiencyBar";
import { useTranslation } from "@/i18n";
import {
  PROFICIENCY_LABELS,
  PROFICIENCY_OPTIONS,
} from "./language-dialog.constants";
import type {
  LanguageFormData,
  ProficiencyType,
} from "../schemas/language.schema";

export interface CatalogLanguageOption {
  name: string;
  native_name?: string | null;
}

export interface LanguageDialogFormFieldsProps {
  register: UseFormRegister<LanguageFormData>;
  errors: FieldErrors<LanguageFormData>;
  isSubmitting: boolean;
  isEdit: boolean;
  catalogLanguages: CatalogLanguageOption[];
  selectedProficiency: ProficiencyType;
  currentLanguageName: string;
  onProficiencyChange: (val: string) => void;
}

export function LanguageDialogFormFields({
  register,
  errors,
  isSubmitting,
  isEdit,
  catalogLanguages,
  selectedProficiency,
  currentLanguageName,
  onProficiencyChange,
}: LanguageDialogFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div>
        <Input
          id="language_name"
          label={t("languages.languageName")}
          alwaysShowLabel
          placeholder={t("languages.languagePlaceholder")}
          disabled={isEdit || isSubmitting}
          list="catalog-languages-list"
          error={errors.name?.message}
          {...register("name")}
        />
        <datalist id="catalog-languages-list">
          {catalogLanguages.map((l) => (
            <option
              key={l.name}
              value={l.name}
              label={l.native_name ? `${l.name} (${l.native_name})` : l.name}
            />
          ))}
        </datalist>
      </div>

      <div className="space-y-2">
        <Select
          id="language_proficiency"
          label={t("languages.proficiency")}
          alwaysShowLabel
          disabled={isSubmitting}
          options={PROFICIENCY_OPTIONS}
          value={selectedProficiency}
          onChange={onProficiencyChange}
          error={errors.proficiency?.message}
        />

        <div className="flex items-center gap-3 px-3 py-2 bg-zinc-100 dark:bg-zinc-800/50">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-roboto">
            {t("common.preview")}
          </span>
          <LanguageProficiencyBar
            proficiency={selectedProficiency || "A1"}
            languageName={currentLanguageName || "Language"}
          />
          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
            {PROFICIENCY_LABELS[selectedProficiency] || selectedProficiency}
          </span>
        </div>
      </div>
    </div>
  );
}
