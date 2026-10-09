"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { loginAction } from "../actions/login.action";
import { useTranslation } from "@/i18n";

export default function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);

    startTransition(async () => {
      const result = await loginAction(data);

      if (result.serverError) {
        setServerError(result.serverError);
      } else if (result.success) {
        let target = callbackUrl || "/users";
        if (target.startsWith("http://") || target.startsWith("https://")) {
          try {
            const url = new URL(target);
            if (
              typeof window !== "undefined" &&
              url.origin === window.location.origin
            ) {
              target = url.pathname + url.search;
            }
          } catch {
            target = "/users";
          }
        }
        router.push(target);
        router.refresh();
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
              className="h-12 w-full border border-cv-border bg-transparent px-3 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
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
              autoComplete="current-password"
              placeholder={t("auth.password")}
              disabled={isPending}
              aria-invalid={errors.password ? "true" : undefined}
              showPasswordToggle={false}
              className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors"
            />

            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden"
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
      </div>

      <div className="mx-auto mt-10 sm:mt-12 flex w-55 flex-col items-center gap-2">
        <Button
          type="submit"
          size="xl"
          className="w-55 shadow-cv-button"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            t("auth.signIn")
          )}
        </Button>

        <Link
          href="/forgot-password"
          className="flex h-12 w-55 items-center justify-center rounded-full font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-muted hover:text-cv-text dark:text-[#C4C4C6] dark:hover:text-[#F5F5F7] transition-colors"
        >
          {t("auth.forgotPassword")}
        </Link>
      </div>
    </form>
  );
}
