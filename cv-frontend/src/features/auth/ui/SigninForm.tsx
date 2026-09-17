"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { authStorage } from "@/lib/auth-storage";
import { gql } from "@/graphql/__generated__";
import type {
  LoginMutation,
  LoginMutationVariables,
} from "@/graphql/__generated__/graphql";

const LOGIN_MUTATION = gql(`
  mutation Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        email
      }
    }
  }
`);

export default function SigninForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [loginMutation, { loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION);

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

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const response = await loginMutation({
        variables: {
          auth: {
            email: data.email,
            password: data.password,
          },
        },
      });

      const authData = response.data?.login;

      if (authData?.access_token && authData?.refresh_token) {
        authStorage.setTokens(authData.access_token, authData.refresh_token);
        router.push(callbackUrl || "/users");
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to sign in. Please try again.");
      }
    }
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
              <input
                {...register("email")}
                className="peer block w-full border border-gray-200 py-2.25 px-3 text-sm outline-2 placeholder:text-gray-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                disabled={loading}
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
              <input
                {...register("password")}
                className="peer block w-full border border-gray-200 py-2.25 px-3 pr-10 text-sm outline-2 placeholder:text-gray-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                disabled={loading}
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
            disabled={loading}
          >
            {loading ? (
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
