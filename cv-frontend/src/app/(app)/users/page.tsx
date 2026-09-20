import { UsersTable } from "@/features/users/ui/UsersTable";

export const metadata = {
  title: "Employees | CV Builder",
  description: "Manage and browse employees directory, positions, and CVs",
};

export default function UsersPage() {
  return <UsersTable />;
}
