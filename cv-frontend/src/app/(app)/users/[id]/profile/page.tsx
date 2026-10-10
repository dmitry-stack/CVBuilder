import { Suspense } from "react";
import { cookies } from "next/headers";
import { ProfileTabs } from "@/features/profile/ui/ProfileTabs";
import {
  ProfileForm,
  type UserProfileData,
} from "@/features/profile/ui/ProfileForm";
import { ProfileSkeleton } from "@/features/profile/ui/ProfileSkeleton";
import { executeAuthMutation } from "@/lib/auth/graphql-auth.server";
import { UserDocument, type UserQuery } from "@/graphql/__generated__/graphql";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `User Profile | CV Builder`,
    description: `Manage profile, skills, languages, and CVs for user ${id}`,
  };
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let initialData: UserProfileData | undefined;
  if (accessToken) {
    try {
      const res = await executeAuthMutation<UserQuery>(
        UserDocument,
        { userId: id },
        { authorization: `Bearer ${accessToken}` },
      );
      const u = res.data?.user;
      if (u) {
        initialData = {
          id: u.id,
          first_name: u.profile?.first_name || "",
          last_name: u.profile?.last_name || "",
          email: u.email,
          department: u.department?.name || "React",
          position: u.position?.name || "Software Engineer",
          role: (u.role as "Employee" | "Admin") || "Employee",
          avatar: u.profile?.avatar || null,
          created_at: u.created_at,
        };
      }
    } catch {
      // In case of server error, client component handles fetching
    }
  }

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <ProfileTabs userId={id} />
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileForm userId={id} initialData={initialData} />
      </Suspense>
    </div>
  );
}
