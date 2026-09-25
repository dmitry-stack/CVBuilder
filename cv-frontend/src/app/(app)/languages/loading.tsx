import { LanguagesSkeleton } from "@/features/languages/ui/LanguagesSkeleton";

export default function LanguagesLoading() {
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <LanguagesSkeleton />
    </div>
  );
}
