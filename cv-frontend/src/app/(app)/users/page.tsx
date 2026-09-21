import { UsersTable } from "@/features/users/ui/UsersTable";
import { Suspense } from "react";
import { UsersTableSkeleton } from "@/features/users/ui/UsersTableSkeleton";

export const metadata = {
  title: "Employees | CV Builder",
  description: "Manage and browse employees directory, positions, and CVs",
};

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <UsersTable />
    </Suspense>
  );
}
