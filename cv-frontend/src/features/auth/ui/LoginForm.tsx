"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { AtSign, KeyRound, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { authStorage } from "@/lib/auth-storage";
import { gql } from "@/graphql/__generated__";

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

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

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
        router.push("/cvs");
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
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 dark:bg-zinc-900">
        <h1 className="mb-3 text-2xl font-semibold">
          Please log in to continue.
        </h1>

        {serverError && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="w-full">
          <div>
            <label
              className="mb-2 mt-4 block text-xs font-medium text-gray-900 dark:text-zinc-200"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                {...register("email")}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                id="email"
                type="email"
                placeholder="Enter your email address"
                disabled={loading}
              />
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:peer-focus:text-zinc-100" />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              className="mb-2 mt-4 block text-xs font-medium text-gray-900 dark:text-zinc-200"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                id="password"
                type="password"
                placeholder="Enter password"
                disabled={loading}
              />
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:peer-focus:text-zinc-100" />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="mt-2 flex justify-center">
          <Button variant="link" type="button" size="sm">
            FORGOT PASSWORD
          </Button>
        </div>
      </div>
    </form>
  );
}
