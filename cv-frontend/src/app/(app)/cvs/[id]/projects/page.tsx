import { CVTabs } from "@/features/cvs/ui/CVTabs";
import { CVProjectsView } from "@/features/projects/ui/CVProjectsView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "CV Projects | CV Builder",
  description: "View and manage projects for this CV",
};

export default async function CVProjectsPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <CVTabs cvId={id} />
      <CVProjectsView cvId={id} />
    </div>
  );
}
