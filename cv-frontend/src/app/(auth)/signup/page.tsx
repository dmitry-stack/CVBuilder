import { Suspense } from "react";
import SignupForm from "@/features/auth/ui/SignupForm";

export default function SignupPage() {
  return (
    <main className="w-full max-w-140">
      <div className="mb-10 text-center">
        <h1 className="font-roboto text-cv-title font-normal tracking-cv-tight text-cv-text dark:text-zinc-100">
          Sign up now
        </h1>
        <p className="mt-6 font-roboto text-base font-normal leading-6 tracking-cv text-cv-text dark:text-zinc-300">
          Welcome! Sign up to continue
        </p>
      </div>
      <Suspense>
        <SignupForm />
      </Suspense>
    </main>
  );
}
