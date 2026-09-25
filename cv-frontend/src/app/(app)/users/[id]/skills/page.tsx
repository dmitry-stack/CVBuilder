import { ProfileTabs } from "@/features/profile/ui/ProfileTabs";
import { UserSkillsView } from "@/features/skills/ui/UserSkillsView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `User Profile | CV Builder`,
    description: `Manage profile, skills, languages, and CVs for user ${id}`,
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
