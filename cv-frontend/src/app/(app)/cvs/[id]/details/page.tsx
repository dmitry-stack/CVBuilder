import { CVTabs } from "@/features/cvs/ui/CVTabs";
import { CVDetailsView } from "@/features/cvs/ui/details/CVDetailsView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "CV Details | CV Builder",
  description: "View and update your CV details",
};

export default async function CVDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <CVTabs cvId={id} />
      <CVDetailsView cvId={id} />
    </div>
  );
}
