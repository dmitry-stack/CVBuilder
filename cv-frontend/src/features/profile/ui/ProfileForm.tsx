"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { ProfileFormFields } from "./ProfileFormFields";
import { HeaderSync } from "@/components/layout/HeaderContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useProfileFormData } from "../hooks/useProfileFormData";
import { sendVerificationAction } from "@/features/auth/actions/send-verification.action";
import { useTranslation, type TranslationKey } from "@/i18n";
import type { ProfileFormData } from "../schemas/profile.schema";
import {
  type UserProfileData,
  DEFAULT_DEPARTMENTS,
  DEFAULT_POSITIONS,
} from "../lib/profile.types";

export type { UserProfileData };
export { DEFAULT_DEPARTMENTS, DEFAULT_POSITIONS };

interface ProfileFormProps {
  userId?: string;
  initialData?: UserProfileData;
  departments?: string[];
  positions?: string[];
  isOwner?: boolean;
  onSave?: (data: ProfileFormData) => void;
  onVerifyEmail?: () => void;
}

function formatMemberSince(
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
  dateString?: string,
): string {
  let dateText = "Sun Jan 14 2024";
  if (dateString) {
    const raw = /^\d+$/.test(dateString.trim()) ? Number(dateString) : dateString;
    const date = new Date(raw);
    if (!isNaN(date.getTime())) {
      dateText = date.toDateString();
    }
  }
  return t("profile.memberSince", { date: dateText });
}

export function ProfileForm({
  userId,
  initialData,
  departments = DEFAULT_DEPARTMENTS,
  positions = DEFAULT_POSITIONS,
  isOwner: propIsOwner,
  onSave,
  onVerifyEmail,
}: ProfileFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isOwnProfile } = useCurrentUser();
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const {
    effectiveUserId,
    activeUser,
    userData,
    userLoading,
    userError,
    refetchUser,
    availableDepartments,
    availablePositions,
    register,
    handleSubmit,
    setValue,
    errors,
    isDirty,
    isSubmitting,
    departmentValue,
    positionValue,
    onSubmit,
  } = useProfileFormData({
    userId,
    initialData,
    departments,
    positions,
    onSave,
  });

  const isOwner =
    typeof propIsOwner === "boolean"
      ? propIsOwner
      : isOwnProfile(effectiveUserId);

  const handleVerifyEmail = async () => {
    if (onVerifyEmail) {
      onVerifyEmail();
      return;
    }
    if (!activeUser.email) return;
    setIsVerifyingEmail(true);
    try {
      await sendVerificationAction(activeUser.email);
    } catch {
      // Proceed to verification view
    } finally {
      setIsVerifyingEmail(false);
      const params = new URLSearchParams({ email: activeUser.email });
      if (effectiveUserId) {
        params.set("callbackUrl", `/users/${effectiveUserId}/profile`);
      }
      router.push(`/verify-email?${params.toString()}`);
    }
  };

  if (userLoading && !initialData) {
    return <ProfileSkeleton />;
  }

  if (userError && !initialData && !userData?.user) {
    return (
      <div
        data-slot="profile-error"
        data-testid="profile-error"
        className="w-full flex flex-col items-center justify-center py-16 text-center space-y-4 font-roboto"
      >
        <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          Failed to load profile
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          {userError.message}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetchUser?.()}>
          {t("system.retry")}
        </Button>
      </div>
    );
  }

  const fullName =
    `${activeUser.first_name} ${activeUser.last_name}`.trim() ||
    activeUser.email ||
    "User";

  return (
    <div
      data-slot="profile-container"
      className="w-full flex flex-col items-center pt-4 sm:pt-8 pb-16"
    >
      <HeaderSync userName={fullName} entityId={effectiveUserId} />

      <div className="flex flex-col items-center text-center">
        <ProfileAvatar
          userId={effectiveUserId}
          initialAvatar={activeUser.avatar}
          userName={fullName}
          editable={isOwner}
        />

        <h1 className="mt-4 text-2xl font-medium text-zinc-900 dark:text-zinc-100 font-roboto">
          {fullName}
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-roboto">
          {activeUser.email}
        </p>

        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 font-roboto">
          {formatMemberSince(t, activeUser.created_at)}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl mt-8 sm:mt-10 space-y-5"
      >
        <ProfileFormFields
          register={register}
          setValue={setValue}
          errors={errors}
          isOwner={isOwner}
          isDirty={isDirty}
          isSubmitting={isSubmitting}
          departmentValue={departmentValue}
          positionValue={positionValue}
          availableDepartments={availableDepartments}
          availablePositions={availablePositions}
          onVerifyEmail={handleVerifyEmail}
          isVerifyingEmail={isVerifyingEmail}
        />
      </form>
    </div>
  );
}
