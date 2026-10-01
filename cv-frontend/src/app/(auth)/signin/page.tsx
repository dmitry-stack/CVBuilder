import { Suspense } from "react";
import LoginForm from "@/features/auth/ui/LoginForm";

export default function SigninPage() {
  return (
    <main className="w-full max-w-140">
      <div className="mb-10 text-center">
        <h1 className="font-roboto text-cv-title font-normal tracking-cv-tight text-cv-text dark:text-[#F5F5F7]">
          Welcome back
        </h1>
        <p className="mt-6 font-roboto text-base font-normal leading-6 tracking-cv text-cv-text dark:text-[#F5F5F7]">
          Hello again! Sign in to continue
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
