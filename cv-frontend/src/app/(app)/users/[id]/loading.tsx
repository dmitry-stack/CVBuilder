import { ProfileSkeleton } from "@/features/profile/ui/ProfileSkeleton";
import { ProfileTabsSkeleton } from "@/features/profile/ui/ProfileTabsSkeleton";

export default function UserLoading() {
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <ProfileTabsSkeleton />
      <ProfileSkeleton />
    </div>
  );
}
