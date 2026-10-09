import { UserLanguagesView } from "@/features/languages/ui/UserLanguagesView";
import { Suspense } from "react";
import { LanguagesSkeleton } from "@/features/languages/ui/LanguagesSkeleton";

export const metadata = {
  title: "Languages | CV Builder",
  description: "Manage your profile languages",
};

export default function LanguagesPage() {
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <Suspense fallback={<LanguagesSkeleton />}>
        <UserLanguagesView isOwner={true} />
      </Suspense>
    </div>
  );
}
