"use client";

import { Suspense } from "react";
import EmailVerificationForm from "@/features/auth/ui/EmailVerificationForm";
import { useTranslation } from "@/i18n";

export default function VerifyEmailPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cv-background px-4 py-12 dark:bg-[#2E2E2E]">
      <main className="w-full max-w-140">
        <div className="mb-10 text-center">
          <h1 className="font-roboto text-cv-title font-normal tracking-cv-tight text-cv-text dark:text-[#F5F5F7]">
            {t("auth.verifyEmailTitle")}
          </h1>
          <p className="mt-4 font-roboto text-base font-normal leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7]">
            {t("auth.verifyEmailSub")}
          </p>
        </div>
        <Suspense
          fallback={
            <div className="h-48 w-full animate-pulse rounded-md bg-cv-surface" />
          }
        >
          <EmailVerificationForm />
        </Suspense>
      </main>
    </div>
  );
}
