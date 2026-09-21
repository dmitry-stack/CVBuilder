"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { loginAction } from "../actions/login.action";

export default function LoginForm() {
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
        router.push(callbackUrl || "/users");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg px-6 pb-4 pt-8 dark:bg-zinc-900">
        {serverError && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="w-full">
          <div>
            <div className="relative">
              <Input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                disabled={isPending}
                aria-invalid={errors.email ? "true" : undefined}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                disabled={isPending}
                aria-invalid={errors.password ? "true" : undefined}
                className="pr-10"
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            className="w-55 rounded-4xl h-12 bg-[#C63031] text-white hover:bg-[#b52a2b]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "LOG IN"
            )}
          </Button>
        </div>

        <div className="mt-2 flex justify-center">
          <Button variant="link" type="button" size="sm">
            FORGOT PASSWORD
          </Button>
        </div>

        <div className="mt-4 pt-4 text-center text-sm text-gray-600 dark:border-zinc-800 dark:text-zinc-400">
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            I DON&apos;T HAVE AN ACCOUNT
          </Link>
        </div>
      </div>
    </form>
  );
}
