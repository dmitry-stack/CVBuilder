import { ProfileSkeleton } from "@/features/profile/ui/ProfileSkeleton";

export default function UserProfileLoading() {
  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-px">
        <div className="flex gap-8">
          <div className="h-10 w-20 border-b-2 border-cv-accent" />
          <div className="h-10 w-16" />
          <div className="h-10 w-24" />
        </div>
      </div>
      <ProfileSkeleton />
    </div>
  );
}
