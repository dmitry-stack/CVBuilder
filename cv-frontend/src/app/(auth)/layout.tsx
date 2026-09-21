import { type ReactNode } from "react";
import { AuthTabs } from "@/features/auth/ui/AuthTabs";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cv-background dark:bg-zinc-950">
      <AuthTabs />
      <div className="flex flex-1 flex-col items-center px-4 pt-10 pb-12 sm:pt-auth-offset">
        {children}
      </div>
    </div>
  );
}
