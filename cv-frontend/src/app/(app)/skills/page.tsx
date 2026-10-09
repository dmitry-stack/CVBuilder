import { UserSkillsView } from "@/features/skills/ui/UserSkillsView";
import { Suspense } from "react";
import { SkillsSkeleton } from "@/features/skills/ui/SkillsSkeleton";

export const metadata = {
  title: "Skills | CV Builder",
  description: "Manage your profile skills",
};

export default function SkillsPage() {
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <Suspense fallback={<SkillsSkeleton />}>
        <UserSkillsView isOwner={true} />
      </Suspense>
    </div>
  );
}
