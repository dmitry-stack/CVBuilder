import { Search } from "lucide-react";
import { UsersTableRowSkeleton } from "./UsersTableRowSkeleton";

interface UsersTableSkeletonProps {
  rowCount?: number;
}

export function UsersTableSkeleton({ rowCount = 5 }: UsersTableSkeletonProps) {
  return (
    <div
      data-slot="users-table-skeleton"
      className="w-full max-w-content mx-auto space-y-6"
    >
      <div className="px-1">
        <div className="relative w-full max-w-search">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cv-muted dark:text-zinc-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search"
            disabled
            className="w-full h-10 pl-10 pr-4 rounded-full border border-cv-border dark:border-zinc-700 bg-transparent text-base leading-cv-input text-cv-text dark:text-zinc-100 placeholder:text-cv-placeholder opacity-60 cursor-not-allowed"
            aria-label="Search employees"
          />
        </div>
      </div>

      <div className=" bg-white dark:bg-zinc-950 shadow-xs overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-table-header border-b border-zinc-200 dark:border-zinc-800 bg-transparent">
              <th className="w-18 px-4" aria-label="Avatar" />
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                First Name
              </th>
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                Last Name
              </th>
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                Email
              </th>
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                Department
              </th>
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                Position
              </th>
              <th className="w-18 px-4" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {Array.from({ length: rowCount }).map((_, idx) => (
              <UsersTableRowSkeleton key={`skeleton-row-${idx}`} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
