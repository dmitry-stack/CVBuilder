import { ProfileTabs } from "@/features/users/ui/ProfileTabs";
import {
  ProfileForm,
  type UserProfileData,
} from "@/features/users/ui/ProfileForm";
import { HeaderSync } from "@/components/layout/HeaderContext";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const MOCK_PROFILES: Record<string, UserProfileData> = {
  "1": {
    id: "1",
    first_name: "Rostislav",
    last_name: "Harlanov",
    email: "thorn_pear@icloud.com",
    department: "React",
    position: "Software Engineer",
    role: "Employee",
    avatar: null,
    created_at: "2024-01-14T12:00:00.000Z",
  },
  "2": {
    id: "2",
    first_name: "Vanf",
    last_name: "Darkholme",
    email: "tomgar9@outlook.com",
    department: ".NET",
    position: "Network Engineer",
    role: "Employee",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    created_at: "2023-11-20T12:00:00.000Z",
  },
  "3": {
    id: "3",
    first_name: "Christopher",
    last_name: "Nolan",
    email: "christophernolan@gmail.com",
    department: "Blockchain",
    position: "DevOps Engineer",
    role: "Admin",
    avatar: null,
    created_at: "2022-05-10T12:00:00.000Z",
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const user = MOCK_PROFILES[id];
  const name = user ? `${user.first_name} ${user.last_name}` : "User Profile";

  return {
    title: `${name} | CV Builder`,
    description: `Manage profile, skills, languages, and CVs for ${name}`,
  };
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;

  const user: UserProfileData = MOCK_PROFILES[id] || {
    id,
    first_name: "Employee",
    last_name: id,
    email: `employee.${id}@innowise.com`,
    department: "React",
    position: "Software Engineer",
    role: "Employee",
    avatar: null,
    created_at: "2024-01-14T12:00:00.000Z",
  };

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <HeaderSync userName={`${user.first_name} ${user.last_name}`} />
      <ProfileTabs userId={user.id} />
      <ProfileForm initialData={user} />
    </div>
  );
}
