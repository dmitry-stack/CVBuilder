import { SkillsSkeleton } from "@/features/skills/ui/SkillsSkeleton";

export default function SkillsLoading() {
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <SkillsSkeleton />
    </div>
  );
}
