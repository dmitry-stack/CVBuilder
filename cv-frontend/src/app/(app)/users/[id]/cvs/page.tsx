import { Suspense } from "react";
import { ProfileTabs } from "@/features/profile/ui/ProfileTabs";
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
    <div className="w-full max-w-content mx-auto space-y-6">
      <ProfileTabs userId={id} />
      <Suspense fallback={<CVTableSkeleton />}>
        <CVTable userId={id} />
      </Suspense>
    </div>
  );
}
