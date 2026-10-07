"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cvProjectFormSchema,
  type CvProjectFormData,
} from "../schemas/cv-project.schema";
import type { CvProjectItem } from "../lib/cv-projects.utils";
import type { AvailableProjectItem } from "../ui/projects/CVProjectDialog";

interface UseCVProjectDialogFormParams {
  initialData: CvProjectItem | null;
  availableProjects: AvailableProjectItem[];
  onSave: (data: CvProjectFormData) => Promise<void>;
}

export function useCVProjectDialogForm({
  initialData,
  availableProjects,
  onSave,
}: UseCVProjectDialogFormParams) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    () =>
      initialData?.project?.id ||
      initialData?.id ||
      availableProjects[0]?.id ||
      "",
  );

  const selectedAvailable = availableProjects.find(
    (p) => String(p.id) === String(selectedProjectId),
  );

  const currentDomain = initialData?.domain || selectedAvailable?.domain || "";

  const [description, setDescription] = useState(
    () => initialData?.description || selectedAvailable?.description || "",
  );

  const [environmentTags, setEnvironmentTags] = useState<string[]>(
    () => initialData?.environment || selectedAvailable?.environment || [],
  );

  const [rolesText, setRolesText] = useState(() =>
    (initialData?.roles || []).join(", "),
  );

  const [respText, setRespText] = useState(() =>
    (initialData?.responsibilities || []).join(", "),
  );

  const [isOngoing] = useState(
    () => !initialData?.end_date && Boolean(initialData),
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CvProjectFormData>({
    resolver: zodResolver(cvProjectFormSchema),
    defaultValues: {
      projectId: selectedProjectId,
      start_date:
        initialData?.start_date || selectedAvailable?.start_date || "",
      end_date: initialData?.end_date || selectedAvailable?.end_date || null,
      description:
        initialData?.description || selectedAvailable?.description || "",
      environment:
        initialData?.environment || selectedAvailable?.environment || [],
      roles: initialData?.roles || [],
      responsibilities: initialData?.responsibilities || [],
    },
  });

  const handleProjectSelect = (projId: string) => {
    setSelectedProjectId(projId);
    setValue("projectId", projId);
    const proj = availableProjects.find((p) => String(p.id) === String(projId));
    if (proj) {
      if (proj.description) setDescription(proj.description);
      if (proj.environment) setEnvironmentTags(proj.environment);
      if (proj.start_date) setValue("start_date", proj.start_date);
      if (proj.end_date) setValue("end_date", proj.end_date);
    }
  };

  const onFormSubmit = async (data: CvProjectFormData) => {
    const roles = rolesText
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const responsibilities = respText
      .split(/,|\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    await onSave({
      ...data,
      projectId: selectedProjectId,
      end_date: isOngoing ? null : data.end_date || null,
      description,
      environment: environmentTags,
      roles,
      responsibilities,
    });
  };


  const startDate =
    useWatch({
      control,
      name: "start_date",
      defaultValue:
        initialData?.start_date || selectedAvailable?.start_date || "",
    }) || "";

  const endDate =
    useWatch({
      control,
      name: "end_date",
      defaultValue:
        initialData?.end_date || selectedAvailable?.end_date || "",
    }) || "";

  return {
    selectedProjectId,
    currentDomain,
    description,
    setDescription,
    environmentTags,
    setEnvironmentTags,
    rolesText,
    setRolesText,
    respText,
    setRespText,
    isOngoing,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleProjectSelect,
    onFormSubmit,
    startDate,
    endDate,
    onStartDateChange: (val: string) => {
      setValue("start_date", val, { shouldValidate: true, shouldDirty: true });
    },
    onEndDateChange: (val: string) => {
      setValue("end_date", val, { shouldValidate: true, shouldDirty: true });
    },
  };
}
