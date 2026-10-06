"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/auth.schema";
import { forgotPasswordAction } from "../actions/forgot-password.action";
import { useTranslation } from "@/i18n";

export default function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await forgotPasswordAction(data);

      if (result.serverError) {
        setServerError(result.serverError);
      } else if (result.success) {
        setSuccessMessage(t("auth.resetLinkSent"));
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

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block font-roboto text-xs font-normal leading-4 text-cv-muted dark:text-[#AEAEAE]"
        >
          {t("auth.email")}
        </label>
        <div className="relative">
          <Input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            disabled={isPending}
            aria-invalid={errors.email ? "true" : undefined}
            className="h-12 w-full border border-cv-border bg-transparent px-3 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mx-auto mt-10 sm:mt-12 flex w-55 flex-col items-center gap-2">
        <Button
          type="submit"
          className="h-12 w-55 rounded-full bg-cv-accent font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-on-accent shadow-cv-button hover:bg-cv-accent-hover transition-all cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            t("auth.resetPassword")
          )}
        </Button>

        <Link
          href="/signin"
          className="flex h-12 w-55 items-center justify-center rounded-full font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-muted hover:text-cv-text dark:text-[#C4C4C6] dark:hover:text-[#F5F5F7] transition-colors"
        >
          {t("auth.cancel")}
        </Link>
      </div>
    </form>
  );
}
