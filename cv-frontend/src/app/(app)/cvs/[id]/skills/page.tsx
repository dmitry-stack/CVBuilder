import { CVTabs } from "@/features/cvs/ui/CVTabs";
import { CVSkillsView } from "@/features/cvs/ui/CVSkillsView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CVSkillsPage({ params }: PageProps) {
  const { id: cvId } = await params;
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <CVTabs cvId={cvId} />
      <CVSkillsView cvId={cvId} />
    </div>
  );
}
