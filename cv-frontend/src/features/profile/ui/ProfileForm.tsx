"use client";

import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ChevronDown } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { profileSchema, type ProfileFormData } from "../schemas/profile.schema";
import { notify } from "@/components/ui/toast";
import { HeaderSync } from "@/components/layout/HeaderContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  UserDocument,
  DepartmentsDocument,
  PositionsDocument,
  UpdateProfileDocument,
  UpdateUserDocument,
  type UserQuery,
  type DepartmentsQuery,
  type PositionsQuery,
} from "@/graphql/__generated__/graphql";

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
  userId?: string;
  initialData?: UserProfileData;
  departments?: string[];
  positions?: string[];
  isOwner?: boolean;
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
  userId,
  initialData,
  departments = DEFAULT_DEPARTMENTS,
  positions = DEFAULT_POSITIONS,
  isOwner: propIsOwner,
  onSave,
}: ProfileFormProps) {
  const { isOwnProfile } = useCurrentUser();
  const effectiveUserId = userId || initialData?.id;
  const isOwner =
    typeof propIsOwner === "boolean"
      ? propIsOwner
      : isOwnProfile(effectiveUserId);

  const { data: userData, loading: userLoading } = useQuery<UserQuery>(
    UserDocument,
    {
      variables: { userId: effectiveUserId || "" },
      skip: !effectiveUserId,
      errorPolicy: "ignore",
    },
  );

  const { data: deptsData } = useQuery<DepartmentsQuery>(DepartmentsDocument, {
    errorPolicy: "ignore",
  });
  const { data: posData } = useQuery<PositionsQuery>(PositionsDocument, {
    errorPolicy: "ignore",
  });

  const [updateProfile] = useMutation(UpdateProfileDocument);
  const [updateUser] = useMutation(UpdateUserDocument);

  const availableDepartments = useMemo(() => {
    if (
      deptsData?.departments?.items &&
      deptsData.departments.items.length > 0
    ) {
      return deptsData.departments.items.map((d) => d.name);
    }
    return departments;
  }, [deptsData, departments]);

  const availablePositions = useMemo(() => {
    if (posData?.positions?.items && posData.positions.items.length > 0) {
      return posData.positions.items.map((p) => p.name);
    }
    return positions;
  }, [posData, positions]);

  const activeUser: UserProfileData = useMemo(() => {
    const u = userData?.user;
    if (u) {
      return {
        id: u.id,
        first_name: u.profile?.first_name || "",
        last_name: u.profile?.last_name || "",
        email: u.email,
        department: u.department?.name || availableDepartments[0] || "React",
        position:
          u.position?.name || availablePositions[0] || "Software Engineer",
        role: (u.role as "Employee" | "Admin") || "Employee",
        avatar: u.profile?.avatar || null,
        created_at: u.created_at,
      };
    }

    return (
      initialData || {
        id: effectiveUserId || "",
        first_name: "",
        last_name: "",
        email: "",
        department: availableDepartments[0] || "React",
        position: availablePositions[0] || "Software Engineer",
        role: "Employee",
        avatar: null,
      }
    );
  }, [
    userData,
    initialData,
    effectiveUserId,
    availableDepartments,
    availablePositions,
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: activeUser.first_name,
      last_name: activeUser.last_name,
      email: activeUser.email,
      department: activeUser.department,
      position: activeUser.position,
      role: activeUser.role,
    },
  });

  useEffect(() => {
    if (userData?.user) {
      const u = userData.user;
      reset({
        first_name: u.profile?.first_name || "",
        last_name: u.profile?.last_name || "",
        email: u.email,
        department: u.department?.name || availableDepartments[0] || "React",
        position:
          u.position?.name || availablePositions[0] || "Software Engineer",
        role: (u.role as "Employee" | "Admin") || "Employee",
      });
    }
  }, [userData, reset, availableDepartments, availablePositions]);

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      onSave?.(formData);

      if (effectiveUserId) {
        await updateProfile({
          variables: {
            profile: {
              userId: effectiveUserId,
              first_name: formData.first_name,
              last_name: formData.last_name,
            },
          },
        });

        const deptItem = deptsData?.departments?.items?.find(
          (d) => d.name === formData.department,
        );
        const posItem = posData?.positions?.items?.find(
          (p) => p.name === formData.position,
        );

        if (deptItem && posItem) {
          await updateUser({
            variables: {
              user: {
                userId: effectiveUserId,
                departmentId: deptItem.id,
                positionId: posItem.id,
                role: (formData.role as "Employee" | "Admin") || "Employee",
              },
            },
          });
        }
      }

      notify.success("Profile changes saved successfully!");
      reset(formData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save profile changes";
      notify.error(msg, "Error");
    }
  };

  const handleCancel = () => {
    reset({
      first_name: activeUser.first_name,
      last_name: activeUser.last_name,
      email: activeUser.email,
      department: activeUser.department,
      position: activeUser.position,
      role: activeUser.role,
    });
  };

  if (userLoading && !initialData) {
    return <ProfileSkeleton />;
  }

  const fullName =
    `${activeUser.first_name} ${activeUser.last_name}`.trim() || "User";

  return (
    <div
      data-slot="profile-container"
      className="w-full flex flex-col items-center pt-4 sm:pt-8 pb-16"
    >
      <HeaderSync userName={fullName} />

      <div className="flex flex-col items-center text-center">
        <ProfileAvatar
          initialAvatar={activeUser.avatar}
          userName={fullName}
          editable={isOwner}
        />

        <h1 className="mt-4 text-2xl font-medium text-zinc-900 dark:text-zinc-100 font-roboto">
          {fullName}
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-roboto">
          {activeUser.email}
        </p>

        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 font-roboto">
          {formatMemberSince(activeUser.created_at)}
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
              disabled={!isOwner}
              {...register("first_name")}
              aria-invalid={!!errors.first_name}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
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
              disabled={!isOwner}
              {...register("last_name")}
              aria-invalid={!!errors.last_name}
              className="w-full h-11 px-3.5 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
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
                disabled={!isOwner}
                {...register("department")}
                className="w-full h-11 px-3.5 pr-9 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto appearance-none focus:outline-hidden focus:ring-1 focus:ring-cv-accent cursor-pointer transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {availableDepartments.map((dept) => (
                  <option
                    key={dept}
                    value={dept}
                    className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    {dept}
                  </option>
                ))}
              </select>
              {isOwner && (
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400"
                  aria-hidden="true"
                />
              )}
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
                disabled={!isOwner}
                {...register("position")}
                className="w-full h-11 px-3.5 pr-9 rounded-xs bg-[#D1D5DB]/70 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-roboto appearance-none focus:outline-hidden focus:ring-1 focus:ring-cv-accent cursor-pointer transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {availablePositions.map((pos) => (
                  <option
                    key={pos}
                    value={pos}
                    className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    {pos}
                  </option>
                ))}
              </select>
              {isOwner && (
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400"
                  aria-hidden="true"
                />
              )}
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

        {isOwner && (
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
        )}
      </form>
    </div>
  );
}
