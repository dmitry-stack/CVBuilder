export function SkillsSkeleton() {
  const categories = [
    { titleWidth: "w-44", count: 2 },
    { titleWidth: "w-24", count: 6 },
    { titleWidth: "w-28", count: 3 },
    { titleWidth: "w-48", count: 1 },
  ];

  return (
    <div
      data-slot="skills-skeleton"
      aria-label="Loading skills"
      className="w-full pt-6 pb-12 space-y-8"
    >
      {categories.map((cat, idx) => (
        <section key={idx} className="space-y-4">
          <div
            className={`h-5 ${cat.titleWidth} rounded-xs bg-zinc-200 dark:bg-zinc-800 animate-pulse`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {Array.from({ length: cat.count }).map((_, itemIdx) => (
              <div key={itemIdx} className="flex items-center gap-3.5 py-1">
                <div className="h-1 w-13 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div
                  className="h-4 rounded-xs bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                  style={{
                    width: `${60 + ((itemIdx * 23) % 50)}px`,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
