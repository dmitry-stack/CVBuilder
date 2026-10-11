import { ReactNode } from "react";
import { ProfileTabs } from "@/features/profile/ui/ProfileTabs";
import { getCurrentUser } from "@/features/auth/actions/get-current-user.server";

interface UserLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function UserLayout({
  children,
  params,
}: UserLayoutProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const isOwner = Boolean(currentUser && String(currentUser.id) === String(id));

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <ProfileTabs userId={id} isOwner={isOwner} />
      {children}
    </div>
  );
}
