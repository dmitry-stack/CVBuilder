import { CVTable } from "@/features/cvs/ui/CVTable";
import { Suspense } from "react";
import { CVTableSkeleton } from "@/features/cvs/ui/CVTableSkeleton";

export const metadata = {
  title: "CVs | CV Builder",
  description: "Manage and browse employees directory, positions, and CVs",
};

export default function CVsPage() {
  return (
    <Suspense fallback={<CVTableSkeleton />}>
      <CVTable />
    </Suspense>
  );
}
