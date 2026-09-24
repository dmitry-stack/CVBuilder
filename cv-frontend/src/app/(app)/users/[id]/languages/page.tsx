import { ProfileTabs } from "@/features/users/ui/ProfileTabs";
import { UserLanguagesView } from "@/features/users/ui/UserLanguagesView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `Languages | CV Builder`,
    description: `Manage and view languages for user ${id}`,
  };
}

export default async function UserLanguagesPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <ProfileTabs userId={id} />
      <UserLanguagesView userId={id} />
    </div>
  );
}
