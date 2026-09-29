import { CVTabs } from "@/features/cvs/ui/CVTabs";

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function CVPreviewPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <CVTabs cvId={id} />
    </div>
  );
}
