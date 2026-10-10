"use client";

import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/i18n";
import type { ProfileFormData } from "../schemas/profile.schema";

interface ProfileFormFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  setValue: UseFormSetValue<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  isOwner: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  departmentValue: string;
  positionValue: string;
  availableDepartments: string[];
  availablePositions: string[];
  onVerifyEmail?: () => void;
  isVerifyingEmail?: boolean;
}

export function ProfileFormFields({
  register,
  setValue,
  errors,
  isOwner,
  isDirty,
  isSubmitting,
  departmentValue,
  positionValue,
  availableDepartments,
  availablePositions,
  onVerifyEmail,
  isVerifyingEmail,
}: ProfileFormFieldsProps) {
  const { t } = useTranslation();

  const departmentOptions = availableDepartments.map((dept) => ({
    value: dept,
    label: dept,
  }));

  const positionOptions = availablePositions.map((pos) => ({
    value: pos,
    label: pos,
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <Input
            id="first_name"
            label={t("profile.firstName")}
            alwaysShowLabel
            placeholder={t("profile.firstName")}
            disabled={!isOwner}
            error={errors.first_name?.message}
            {...register("first_name")}
          />
        </div>

        <div>
          <Input
            id="last_name"
            label={t("profile.lastName")}
            alwaysShowLabel
            placeholder={t("profile.lastName")}
            disabled={!isOwner}
            error={errors.last_name?.message}
            {...register("last_name")}
          />
        </div>

        <div>
          <Select
            id="department"
            label={t("profile.department")}
            alwaysShowLabel
            disabled={!isOwner}
            options={departmentOptions}
            value={departmentValue}
            onChange={(val) =>
              setValue("department", val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.department?.message}
          />
        </div>

        <div>
          <Select
            id="position"
            label={t("profile.position")}
            alwaysShowLabel
            disabled={!isOwner}
            options={positionOptions}
            value={positionValue}
            onChange={(val) =>
              setValue("position", val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.position?.message}
          />
        </div>
      </div>

      <input type="hidden" {...register("email")} />
      <input type="hidden" {...register("role")} />

      {isOwner && (
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onVerifyEmail}
            disabled={isVerifyingEmail}
          >
            {t("auth.verifyEmail")}
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={!isDirty || isSubmitting}
            className="shadow-cv-button"
          >
            {isSubmitting ? t("common.saving") : t("common.update")}
          </Button>
        </div>
      )}
    </>
  );
}
