"use client";

import { useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@apollo/client/react";
import { profileSchema, type ProfileFormData } from "../schemas/profile.schema";
import { notify } from "@/components/ui/toast";
import {
  UserDocument,
  DepartmentsDocument,
  PositionsDocument,
  UpdateProfileDocument,
  UpdateUserDocument,
  type UserQuery,
} from "@/graphql/__generated__/graphql";
import {
  type UserProfileData,
  DEFAULT_DEPARTMENTS,
  DEFAULT_POSITIONS,
} from "../lib/profile.types";

interface UseProfileFormDataParams {
  userId?: string;
  initialData?: UserProfileData;
  departments?: string[];
  positions?: string[];
  onSave?: (data: ProfileFormData) => void;
}

export function useProfileFormData({
  userId,
  initialData,
  departments = DEFAULT_DEPARTMENTS,
  positions = DEFAULT_POSITIONS,
  onSave,
}: UseProfileFormDataParams) {
  const effectiveUserId = userId || initialData?.id;

  const {
    data: userData,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery<UserQuery>(UserDocument, {
    variables: { userId: effectiveUserId || "" },
    skip: !effectiveUserId,
    errorPolicy: "all",
  });
  const { data: deptsData } = useQuery(DepartmentsDocument, { errorPolicy: "ignore" });
  const { data: posData } = useQuery(PositionsDocument, { errorPolicy: "ignore" });

  const [updateProfile] = useMutation(UpdateProfileDocument);
  const [updateUser] = useMutation(UpdateUserDocument);

  const availableDepartments = useMemo(() => {
    const items = deptsData?.departments?.items;
    return items && items.length > 0 ? items.map((d) => d.name) : departments;
  }, [deptsData, departments]);

  const availablePositions = useMemo(() => {
    const items = posData?.positions?.items;
    return items && items.length > 0 ? items.map((p) => p.name) : positions;
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
        position: u.position?.name || availablePositions[0] || "Software Engineer",
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
  }, [userData, initialData, effectiveUserId, availableDepartments, availablePositions]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: activeUser.first_name, last_name: activeUser.last_name, email: activeUser.email,
      department: activeUser.department, position: activeUser.position, role: activeUser.role,
    },
  });

  const departmentValue = useWatch({ control, name: "department", defaultValue: activeUser.department });
  const positionValue = useWatch({ control, name: "position", defaultValue: activeUser.position });

  useEffect(() => {
    if (userData?.user) {
      const u = userData.user;
      reset({
        first_name: u.profile?.first_name || "",
        last_name: u.profile?.last_name || "",
        email: u.email,
        department: u.department?.name || availableDepartments[0] || "React",
        position: u.position?.name || availablePositions[0] || "Software Engineer",
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
        const deptItem = deptsData?.departments?.items?.find((d) => d.name === formData.department);
        const posItem = posData?.positions?.items?.find((p) => p.name === formData.position);
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
      const msg = err instanceof Error ? err.message : "Failed to save profile changes";
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

  const isEffectiveLoading = Boolean(userLoading && !initialData);

  return {
    effectiveUserId,
    activeUser,
    userData,
    userLoading: isEffectiveLoading,
    userError,
    refetchUser,
    availableDepartments,
    availablePositions,
    register,
    handleSubmit,
    setValue,
    errors,
    isDirty,
    isSubmitting,
    departmentValue,
    positionValue,
    onSubmit,
    handleCancel,
  };
}
