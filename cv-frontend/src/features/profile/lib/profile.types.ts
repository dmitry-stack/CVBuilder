export interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  role: "Employee" | "Admin";
  avatar: string | null;
  created_at?: string;
}

export const DEFAULT_DEPARTMENTS = [
  "React",
  ".NET",
  "Blockchain",
  "DevOps",
  "Global",
  "Quality Assurance",
  "Mobile",
  "Design",
];

export const DEFAULT_POSITIONS = [
  "Software Engineer",
  "Network Engineer",
  "DevOps Engineer",
  "Data Analyst",
  "Project Manager",
  "QA Engineer",
  "UI/UX Designer",
];
