import { CVTabs } from "@/features/cvs/ui/CVTabs";

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function CVPreviewPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <>
      <CVTabs userId={id} />
    </>
  );
}
