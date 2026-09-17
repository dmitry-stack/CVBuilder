import { LogoutButton } from "@/features/users/ui/LogoutButton";
export default function UsersPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <h1>Users</h1>
      <LogoutButton />
    </main>
  );
}
