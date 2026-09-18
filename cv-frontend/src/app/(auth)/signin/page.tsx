import { Suspense } from "react";

import SigninForm from "@/features/auth/ui/SigninForm";

export default function SigninPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-100 flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">Sign in now</h1>
          <p className="text-md text-gray-500 dark:text-zinc-400 mt-1">
            Welcome back! Sign in to continue
          </p>
        </div>
        <Suspense>
          <SigninForm />
        </Suspense>
      </div>
    </main>
  );
}
