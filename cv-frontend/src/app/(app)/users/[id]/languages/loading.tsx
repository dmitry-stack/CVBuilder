import { LanguagesSkeleton } from "@/features/languages/ui/LanguagesSkeleton";

export default function UserLanguagesLoading() {
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <div className="flex h-12 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex h-12 w-auth-tab shrink-0 flex-col items-center justify-end">
          <div className="h-auth-link flex items-center justify-center text-sm font-medium text-zinc-400">
            PROFILE
          </div>
          <div className="h-auth-rule w-auth-tab bg-transparent" />
        </div>
        <div className="flex h-12 w-auth-tab shrink-0 flex-col items-center justify-end">
          <div className="h-auth-link flex items-center justify-center text-sm font-medium text-zinc-400">
            SKILLS
          </div>
          <div className="h-auth-rule w-auth-tab bg-transparent" />
        </div>
        <div className="flex h-12 w-auth-tab shrink-0 flex-col items-center justify-end">
          <div className="h-auth-link flex items-center justify-center text-sm font-semibold text-cv-accent">
            LANGUAGES
          </div>
          <div className="h-auth-rule w-auth-tab bg-cv-accent" />
        </div>
      </div>
      <LanguagesSkeleton />
    </div>
  );
}
