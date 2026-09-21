"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { profileSchema, type ProfileFormData } from "../schemas/profile.schema";

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

interface ProfileFormProps {
  initialData: UserProfileData;
  departments?: string[];
  positions?: string[];
  onSave?: (data: ProfileFormData) => void;
}

const DEFAULT_DEPARTMENTS = [
  "React",
  ".NET",
  "Blockchain",
  "DevOps",
  "Global",
  "Quality Assurance",
  "Mobile",
  "Design",
];

const DEFAULT_POSITIONS = [
  "Software Engineer",
  "Network Engineer",
  "DevOps Engineer",
  "Data Analyst",
  "Project Manager",
  "QA Engineer",
  "UI/UX Designer",
];

function formatMemberSince(dateString?: string): string {
  if (!dateString) return "A member since Sun Jan 14 2024";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "A member since Sun Jan 14 2024";
    return `A member since ${date.toDateString()}`;
  } catch {
    return "A member since Sun Jan 14 2024";
  }
}

export function ProfileForm({
  initialData,
  departments = DEFAULT_DEPARTMENTS,
  positions = DEFAULT_POSITIONS,
  onSave,
}: ProfileFormProps) {
  const [successMessage, setSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      email: initialData.email,
      department: initialData.department,
      position: initialData.position,
      role: initialData.role,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    onSave?.(data);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const handleCancel = () => {
    reset({
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      email: initialData.email,
      department: initialData.department,
      position: initialData.position,
      role: initialData.role,
    });
    setSuccessMessage(false);
  };

  return (
    <div
      data-slot="profile-container"
      className="w-full flex flex-col items-center pt-4 sm:pt-8 pb-16"
    >
      {successMessage && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400"
        >
          <Check className="h-4 w-4 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <ProfileAvatar
          initialAvatar={initialData.avatar}
          userName={`${initialData.first_name} ${initialData.last_name}`}
        />

        <h1 className="mt-4 text-2xl font-medium text-zinc-900 dark:text-zinc-100 font-roboto">
          {initialData.first_name} {initialData.last_name}
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-roboto">
          {initialData.email}
        </p>

        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 font-roboto">
          {formatMemberSince(initialData.created_at)}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl mt-8 sm:mt-10 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="First Name"
              {...register("first_name")}
              aria-invalid={!!errors.first_name}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors"
            />
            {errors.first_name && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.first_name.message}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="Last Name"
              {...register("last_name")}
              aria-invalid={!!errors.last_name}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors"
            />
            {errors.last_name && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.last_name.message}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Department
            </label>
            <div className="relative">
              <select
                id="department"
                {...register("department")}
                className="w-full h-11 px-3.5 pr-9 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto appearance-none focus:outline-hidden focus:ring-1 focus:ring-cv-accent cursor-pointer transition-colors"
              >
                {departments.map((dept) => (
                  <option
                    key={dept}
                    value={dept}
                    className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400"
                aria-hidden="true"
              />
            </div>
            {errors.department && (
              <p className="mt-1 text-xs text-destructive">
                {errors.department.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5 font-roboto"
            >
              Position
            </label>
            <div className="relative">
              <select
                id="position"
                {...register("position")}
                className="w-full h-11 px-3.5 pr-9 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto appearance-none focus:outline-hidden focus:ring-1 focus:ring-cv-accent cursor-pointer transition-colors"
              >
                {positions.map((pos) => (
                  <option
                    key={pos}
                    value={pos}
                    className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    {pos}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400"
                aria-hidden="true"
              />
            </div>
            {errors.position && (
              <p className="mt-1 text-xs text-destructive">
                {errors.position.message}
              </p>
            )}
          </div>
        </div>

        <input type="hidden" {...register("email")} />
        <input type="hidden" {...register("role")} />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={!isDirty || isSubmitting}
            className="rounded-full px-6 h-10 text-sm font-medium cursor-pointer"
          >
            Cancel
          </Button>
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white px-8 h-10 text-sm font-medium uppercase tracking-wider shadow-cv-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-hidden"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
