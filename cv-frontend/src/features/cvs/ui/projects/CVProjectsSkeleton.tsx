export function CVProjectsSkeleton() {
  return (
    <div
      data-slot="cv-projects-skeleton"
      aria-label="Loading projects"
      className="w-full space-y-6 animate-pulse font-roboto"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-72 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-28 rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="col-span-4 h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
        <div className="col-span-3 h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
        <div className="col-span-2 h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
        <div className="col-span-2 h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
        <div className="col-span-1" />
      </div>

      {/* Rows */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border-b border-zinc-200 dark:border-zinc-800 py-5 space-y-3"
        >
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4 h-5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
            <div className="col-span-3 h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
            <div className="col-span-2 h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
            <div className="col-span-2 h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
            <div className="col-span-1 flex justify-end">
              <div className="h-5 w-5 bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
            </div>
          </div>
          <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xs" />
          <div className="flex gap-2">
            <div className="h-6 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-6 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
