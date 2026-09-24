import { ProfileTabs } from "@/features/users/ui/ProfileTabs";
import { UserSkillsView } from "@/features/users/ui/UserSkillsView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `Skills | CV Builder`,
    description: `Manage and view skills for user ${id}`,
  };
}

export default async function UserSkillsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <ProfileTabs userId={id} />
      <UserSkillsView userId={id} />
    </div>
  );
}
