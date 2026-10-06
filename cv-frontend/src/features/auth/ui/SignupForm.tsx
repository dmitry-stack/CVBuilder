"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupFormData } from "../schemas/auth.schema";
import { signupAction } from "../actions/signup.action";
import { useTranslation } from "@/i18n";

export default function SignupForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setServerError(null);

    startTransition(async () => {
      const result = await signupAction(data);

      if (result.serverError) {
        setServerError(result.serverError);
      } else if (result.success) {
        const verifyParams = new URLSearchParams();
        verifyParams.set("email", data.email);
        if (callbackUrl) {
          verifyParams.set("callbackUrl", callbackUrl);
        }
        router.push(`/verify-email?${verifyParams.toString()}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {serverError && (
        <div className="mb-6 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-9">
        <div>
          <div className="relative">
            <Input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("auth.email")}
              disabled={isPending}
              aria-invalid={errors.email ? "true" : undefined}
              className="h-12 w-full border border-cv-border bg-transparent px-3 font-roboto text-base leading-cv-input tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <Input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.password")}
              disabled={isPending}
              aria-invalid={errors.password ? "true" : undefined}
              className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-cv-input tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
            />

            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-6 w-6" />
              ) : (
                <Eye className="h-6 w-6" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.password.message}
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
              disabled={isPending}
              aria-invalid={errors.confirmPassword ? "true" : undefined}
              className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-cv-input tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
            />

            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
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
          className="h-12 w-55 rounded-full bg-cv-accent font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-on-accent shadow-cv-button hover:bg-cv-accent-hover transition-all cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            t("auth.createAccount")
          )}
        </Button>

        <Link
          href="/signin"
          className="flex h-12 w-55 items-center justify-center rounded-full font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-muted hover:text-cv-text dark:text-[#C4C4C6] dark:hover:text-[#F5F5F7] transition-colors"
        >
          {t("auth.haveAccount")}
        </Link>
      </div>
    </form>
  );
}
