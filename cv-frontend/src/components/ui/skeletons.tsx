import { Skeleton } from "./skeleton";

export { Skeleton } from "./skeleton";

interface TableRowSkeletonProps {
  cols?: number;
}

export function TableRowSkeleton({ cols = 7 }: TableRowSkeletonProps) {
  return (
    <tr
      data-slot="table-row-skeleton"
      className="h-table-row border-b border-zinc-200 dark:border-zinc-800"
    >
      <td className="px-4">
        <Skeleton className="h-10 w-10 rounded-full" />
      </td>
      {Array.from({ length: Math.max(1, cols - 2) }).map((_, idx) => (
        <td key={`col-${idx}`} className="px-4">
          <Skeleton className="h-4 w-24" />
        </td>
      ))}
      <td className="px-4 text-right">
        <Skeleton className="h-10 w-10 rounded-full ml-auto" />
      </td>
    </tr>
  );
}

interface TableSkeletonProps {
  rowCount?: number;
  cols?: number;
}

export function TableSkeleton({ rowCount = 5, cols = 7 }: TableSkeletonProps) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-table-header border-b border-zinc-200 dark:border-zinc-800 bg-transparent">
            {Array.from({ length: cols }).map((_, idx) => (
              <th key={`header-${idx}`} className="px-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {Array.from({ length: rowCount }).map((_, idx) => (
            <TableRowSkeleton key={`row-${idx}`} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
