"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/auth.schema";
import { resetPasswordAction } from "../actions/reset-password.action";
import { useTranslation } from "@/i18n";

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    if (!token) {
      setServerError(
        "Reset token is missing. Please use the link sent to your email.",
      );
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction({
        ...data,
        token,
      });

      if (result.serverError) {
        setServerError(result.serverError);
      } else if (result.success) {
        setSuccessMessage(t("auth.resetSuccess"));
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {serverError && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {!token && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-md bg-amber-500/15 p-3 text-sm text-amber-600 dark:text-amber-400"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            No reset token provided. Please open this page using the link in
            your email.
          </span>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="relative">
            <Input
              {...register("newPassword")}
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.newPassword")}
              disabled={isPending || !token}
              aria-invalid={errors.newPassword ? "true" : undefined}
              showPasswordToggle={false}
              className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden"
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
            <p className="mt-1.5 text-xs text-destructive">
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
              placeholder={t("auth.confirmPassword")}
              disabled={isPending || !token}
              aria-invalid={errors.confirmPassword ? "true" : undefined}
              showPasswordToggle={false}
              className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden"
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
            <p className="mt-1.5 text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto mt-10 sm:mt-12 flex w-55 flex-col items-center gap-2">
        <Button
          type="submit"
          size="xl"
          className="w-55 shadow-cv-button"
          disabled={isPending || !token}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            t("auth.submit")
          )}
        </Button>

        <Link
          href="/signin"
          className="flex h-12 w-55 items-center justify-center rounded-full font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-muted hover:text-cv-text dark:text-[#C4C4C6] dark:hover:text-[#F5F5F7] transition-colors"
        >
          {t("auth.goToSignIn")}
        </Link>
      </div>
    </form>
  );
}
