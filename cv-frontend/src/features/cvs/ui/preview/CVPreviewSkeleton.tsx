export function CVPreviewSkeleton() {
  return (
    <div
      data-slot="cv-preview-skeleton"
      aria-label="Loading CV preview"
      className="w-full px-32 pt-8 pb-16 max-w-content mx-auto space-y-8 animate-pulse font-roboto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/60 dark:border-zinc-800">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full self-start sm:self-center" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 pt-2">
        <div className="w-full md:w-[32%] shrink-0 space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-36 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="w-full md:w-[68%] pl-0 md:pl-6 border-l-0 md:border-l-2 border-[#E57373]/30 dark:border-red-900/30 space-y-4">
          <div className="h-5 w-44 bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-4/5 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="pt-2 space-y-3">
            <div className="space-y-1">
              <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="space-y-1">
              <div className="h-3.5 w-28 bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 space-y-6">
        <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-[32%] shrink-0 space-y-2">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="w-full md:w-[68%] pl-0 md:pl-6 border-l-0 md:border-l-2 border-[#E57373]/30 dark:border-red-900/30 space-y-4">
            <div className="space-y-1">
              <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="space-y-1">
              <div className="h-3.5 w-16 bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
