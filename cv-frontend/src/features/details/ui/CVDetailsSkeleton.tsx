export function CVDetailsSkeleton() {
  return (
    <div
      data-slot="cv-details-skeleton"
      aria-label="Loading CV details"
      className="w-full max-w-4xl pt-6 pb-16 space-y-5 animate-pulse font-roboto"
    >
      <div>
        <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-xs mb-2" />
        <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
      </div>

      <div>
        <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-xs mb-2" />
        <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
      </div>

      <div>
        <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xs mb-2" />
        <div className="h-40 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
      </div>

      <div className="flex justify-end pt-4">
        <div className="h-10 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
}
