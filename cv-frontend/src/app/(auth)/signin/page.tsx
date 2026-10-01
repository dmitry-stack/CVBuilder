"use client";

import { Suspense } from "react";
import LoginForm from "@/features/auth/ui/LoginForm";
import { useTranslation } from "@/i18n";

export default function SigninPage() {
  const { t } = useTranslation();

  return (
    <main className="w-full max-w-140">
      <div className="mb-10 text-center">
        <h1 className="font-roboto text-cv-title font-normal tracking-cv-tight text-cv-text dark:text-[#F5F5F7]">
          {t("auth.welcomeBack")}
        </h1>
        <p className="mt-6 font-roboto text-base font-normal leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7]">
          {t("auth.welcomeBackSub")}
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
