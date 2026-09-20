import { Suspense } from "react";
import SignupForm from "@/features/auth/ui/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-100 flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">Sign up now</h1>
          <p className="text-md text-gray-500 dark:text-zinc-400 mt-1">
            Welcome! Sign up to continue
          </p>
        </div>
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}
