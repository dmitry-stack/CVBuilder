import { Suspense } from "react";
import { CVTable } from "@/features/cvs/ui/CVTable";
import { CVTableSkeleton } from "@/features/cvs/ui/CVTableSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `User CVs | CV Builder`,
    description: `Manage profile, skills, languages, and CVs for user ${id}`,
  };
}

export default async function UserCvsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<CVTableSkeleton />}>
      <CVTable userId={id} />
    </Suspense>
  );
}
