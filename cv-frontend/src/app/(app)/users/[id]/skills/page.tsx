import { cookies } from "next/headers";
import { ProfileTabs } from "@/features/profile/ui/ProfileTabs";
import {
  UserSkillsView,
  type UserSkillsViewProps,
} from "@/features/skills/ui/UserSkillsView";
import { executeAuthMutation } from "@/shared/lib/auth/graphql-auth.server";
import {
  ProfileSkillsDocument,
  type ProfileSkillsQuery,
} from "@/graphql/__generated__/graphql";
import type { MasteryType } from "@/features/skills/schemas/skill.schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `User Skills | CV Builder`,
    description: `Manage profile, skills, languages, and CVs for user ${id}`,
  };
}

export default async function UserSkillsPage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let initialProfile: UserSkillsViewProps["initialProfile"] = undefined;
  if (accessToken) {
    try {
      const res = await executeAuthMutation<ProfileSkillsQuery>(
        ProfileSkillsDocument,
        { userId: id },
        { authorization: `Bearer ${accessToken}` },
      );
      if (res.data?.profile) {
        initialProfile = {
          id: res.data.profile.id,
          first_name: res.data.profile.first_name,
          last_name: res.data.profile.last_name,
          skills: res.data.profile.skills.map(
            (s: NonNullable<ProfileSkillsQuery["profile"]>["skills"][number]) => ({
              name: s.name,
              categoryId: s.categoryId,
              mastery: s.mastery as MasteryType,
            }),
          ),
        };
      }
    } catch {
      // In case of server error, client component handles fetching
    }
  }

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <ProfileTabs userId={id} />
      <UserSkillsView userId={id} initialProfile={initialProfile} />
    </div>
  );
}
