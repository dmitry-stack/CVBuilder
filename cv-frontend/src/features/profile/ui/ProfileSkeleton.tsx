export function ProfileSkeleton() {
  return (
    <div
      data-slot="profile-skeleton"
      className="w-full flex flex-col items-center pt-4 sm:pt-8 pb-16 animate-pulse"
    >
      <div className="flex flex-col items-center text-center">
        <div className="h-32 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-4 h-7 w-52 rounded-md bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-2 h-4 w-44 rounded-md bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-2 h-3.5 w-48 rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="w-full max-w-xl mt-8 sm:mt-10 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <div className="h-3 w-16 rounded-xs bg-zinc-200 dark:bg-zinc-800 mb-1.5" />
            <div className="h-11 w-full rounded-xs bg-[#D1D5DB]/50 dark:bg-zinc-800" />
          </div>

          <div>
            <div className="h-3 w-16 rounded-xs bg-zinc-200 dark:bg-zinc-800 mb-1.5" />
            <div className="h-11 w-full rounded-xs bg-[#D1D5DB]/50 dark:bg-zinc-800" />
          </div>

          <div>
            <div className="h-3 w-20 rounded-xs bg-zinc-200 dark:bg-zinc-800 mb-1.5" />
            <div className="h-11 w-full rounded-xs bg-[#D1D5DB]/50 dark:bg-zinc-800" />
          </div>

          <div>
            <div className="h-3 w-16 rounded-xs bg-zinc-200 dark:bg-zinc-800 mb-1.5" />
            <div className="h-11 w-full rounded-xs bg-[#D1D5DB]/50 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
