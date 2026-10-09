"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/features/auth/schemas/auth.schema";
import { changePasswordAction } from "@/features/auth/actions/change-password.action";

export function ChangePasswordForm() {
  const { t } = useTranslation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await changePasswordAction(data);

      if (result.serverError) {
        setServerError(result.serverError);
      } else if (result.success) {
        setSuccessMessage(t("settings.changePasswordSuccess"));
        reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div>
        <div className="relative">
          <Input
            {...register("currentPassword")}
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={t("settings.currentPassword")}
            disabled={isPending}
            aria-invalid={errors.currentPassword ? "true" : undefined}
            showPasswordToggle={false}
            className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden cursor-pointer"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={
              showCurrentPassword
                ? "Hide current password"
                : "Show current password"
            }
          >
            {showCurrentPassword ? (
              <EyeOff className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-destructive">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <div className="relative">
          <Input
            {...register("newPassword")}
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("settings.newPassword")}
            disabled={isPending}
            aria-invalid={errors.newPassword ? "true" : undefined}
            showPasswordToggle={false}
            className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden cursor-pointer"
            onClick={() => setShowNewPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={
              showNewPassword ? "Hide new password" : "Show new password"
            }
          >
            {showNewPassword ? (
              <EyeOff className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <div className="relative">
          <Input
            {...register("confirmPassword")}
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("settings.confirmPassword")}
            disabled={isPending}
            aria-invalid={errors.confirmPassword ? "true" : undefined}
            showPasswordToggle={false}
            className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={
              showConfirmPassword
                ? "Hide confirmation password"
                : "Show confirmation password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center gap-4">
        <Button
          type="submit"
          size="xl"
          className="w-55 shadow-cv-button"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("common.saving")}
            </>
          ) : (
            t("settings.changePasswordBtn")
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="xl"
          className="w-55"
          disabled={isPending}
          onClick={() => {
            reset();
            setServerError(null);
            setSuccessMessage(null);
          }}
        >
          {t("settings.cancel")}
        </Button>
      </div>
    </form>
  );
}
