import { CVTable } from "@/features/cvs/ui/CVTable";
import { Suspense } from "react";
import { UsersTableSkeleton } from "@/features/users/ui/UsersTableSkeleton";

export const metadata = {
  title: "CVs | CV Builder",
  description: "Manage and browse emplo yees directory, positions, and CVs",
};

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <CVTable />
    </Suspense>
  );
}
