import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/get-current-user.server";
import { UserLanguagesView } from "@/features/languages/ui/UserLanguagesView";

export const metadata = {
  title: "Languages | CV Builder",
  description: "Manage your profile languages",
};

export default async function LanguagesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    redirect("/signin");
  }

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <UserLanguagesView userId={currentUser.id} isOwner={true} />
    </div>
  );
}
