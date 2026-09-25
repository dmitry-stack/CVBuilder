import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/get-current-user.server";
import { UserSkillsView } from "@/features/skills/ui/UserSkillsView";

export const metadata = {
  title: "Skills | CV Builder",
  description: "Manage your profile skills",
};

export default async function SkillsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    redirect("/signin");
  }

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <UserSkillsView userId={currentUser.id} isOwner={true} />
    </div>
  );
}
