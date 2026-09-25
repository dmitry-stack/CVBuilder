import { ProfileTabs } from "@/features/profile/ui/ProfileTabs";
import { UserLanguagesView } from "@/features/languages/ui/UserLanguagesView";
import { getCurrentUser } from "@/features/auth/actions/get-current-user.server";

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
  const currentUser = await getCurrentUser();

  const isOwner = currentUser?.id === id;

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      {!isOwner && <ProfileTabs userId={id} />}

      <UserLanguagesView userId={id} />
    </div>
  );
}
