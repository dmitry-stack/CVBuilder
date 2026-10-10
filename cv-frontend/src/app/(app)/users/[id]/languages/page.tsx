import { cookies } from "next/headers";
import { ProfileTabs } from "@/features/profile/ui/ProfileTabs";
import {
  UserLanguagesView,
  type UserLanguagesViewProps,
} from "@/features/languages/ui/UserLanguagesView";
import { executeAuthMutation } from "@/lib/auth/graphql-auth.server";
import {
  ProfileLanguagesDocument,
  type ProfileLanguagesQuery,
} from "@/graphql/__generated__/graphql";
import type { ProficiencyType } from "@/features/languages/schemas/language.schema";

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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let initialProfile: UserLanguagesViewProps["initialProfile"] = undefined;
  if (accessToken) {
    try {
      const res = await executeAuthMutation<ProfileLanguagesQuery>(
        ProfileLanguagesDocument,
        { userId: id },
        { authorization: `Bearer ${accessToken}` },
      );
      if (res.data?.profile) {
        initialProfile = {
          id: res.data.profile.id,
          first_name: res.data.profile.first_name,
          last_name: res.data.profile.last_name,
          languages: res.data.profile.languages.map((l) => ({
            name: l.name,
            proficiency: l.proficiency as ProficiencyType,
          })),
        };
      }
    } catch {
      // In case of server error, client component handles fetching
    }
  }

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <ProfileTabs userId={id} />

      <UserLanguagesView userId={id} initialProfile={initialProfile} />
    </div>
  );
}
