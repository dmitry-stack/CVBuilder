import { Skeleton } from "@/components/ui/skeleton";

export function UsersTableRowSkeleton() {
  return (
    <tr
      data-slot="users-table-row-skeleton"
      className="h-table-row border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Avatar */}
      <td className="px-4">
        <Skeleton className="h-10 w-10 rounded-full" />
      </td>

      {/* First Name */}
      <td className="px-4">
        <Skeleton className="h-4 w-24" />
      </td>

      {/* Last Name */}
      <td className="px-4">
        <Skeleton className="h-4 w-24" />
      </td>

      {/* Email */}
      <td className="px-4">
        <Skeleton className="h-4 w-40 max-w-email" />
      </td>

      {/* Department */}
      <td className="px-4">
        <Skeleton className="h-4 w-20" />
      </td>

      {/* Position */}
      <td className="px-4">
        <Skeleton className="h-4 w-28" />
      </td>

      {/* Actions */}
      <td className="px-4 text-right">
        <Skeleton className="h-10 w-10 rounded-full ml-auto" />
      </td>
    </tr>
  );
}
