import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CVTableSkeletonProps {
  rowCount?: number;
}

export function CVTableSkeleton({ rowCount = 5 }: CVTableSkeletonProps) {
  return (
    <div
      data-slot="cv-table-skeleton"
      className="w-full max-w-content mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-1">
        <div className="relative w-full max-w-search">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cv-muted dark:text-zinc-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search CVs..."
            disabled
            className="w-full h-10 pl-10 pr-4 rounded-full border border-cv-border dark:border-zinc-700 bg-transparent text-base leading-cv-input text-cv-text dark:text-zinc-100 placeholder:text-cv-placeholder opacity-60 cursor-not-allowed"
            aria-label="Search CVs"
          />
        </div>

        <div className="flex items-center justify-end">
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-zinc-950 shadow-xs">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-table-header border-b border-zinc-200 dark:border-zinc-800 bg-transparent">
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                Name
              </th>
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                Education
              </th>
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                Employee
              </th>
              <th className="w-18 px-4 text-right" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {Array.from({ length: rowCount }).map((_, idx) => (
              <tr
                key={`cv-skeleton-row-${idx}`}
                data-slot="cv-table-row-skeleton"
                className="h-table-row border-b border-zinc-200 dark:border-zinc-800"
              >
                {/* Name & Description */}
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-40 mb-1.5" />
                  <Skeleton className="h-3 w-64 max-w-full" />
                </td>

                {/* Education */}
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-44" />
                </td>

                {/* Employee */}
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-32" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
