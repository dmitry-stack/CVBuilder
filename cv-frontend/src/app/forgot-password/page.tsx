"use client";

import { Suspense } from "react";
import ForgotPasswordForm from "@/features/auth/ui/ForgotPasswordForm";
import { useTranslation } from "@/i18n";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cv-background px-4 py-12 dark:bg-[#2E2E2E]">
      <main className="w-full max-w-140">
        <div className="mb-10 text-center">
          <h1 className="font-roboto text-cv-title font-normal tracking-cv-tight text-cv-text dark:text-[#F5F5F7]">
            {t("auth.forgotPasswordTitle")}
          </h1>
          <p className="mt-4 font-roboto text-base font-normal leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7]">
            {t("auth.forgotPasswordSub")}
          </p>
        </div>
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
