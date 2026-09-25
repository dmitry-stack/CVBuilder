export function LanguagesSkeleton() {
  return (
    <div
      data-slot="languages-skeleton"
      aria-label="Loading languages"
      className="w-full pt-6 pb-12 space-y-4"
    >
      <div className="h-5 w-32 rounded-xs bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        {Array.from({ length: 6 }).map((_, itemIdx) => (
          <div key={itemIdx} className="flex items-center gap-3.5 py-1">
            <div className="h-1 w-13 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div
              className="h-4 rounded-xs bg-zinc-200 dark:bg-zinc-800 animate-pulse"
              style={{ width: `${80 + ((itemIdx * 29) % 60)}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
