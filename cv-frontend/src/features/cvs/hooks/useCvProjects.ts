"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  CvProjectsDocument,
  AvailableProjectsDocument,
  AddCvProjectDocument,
  UpdateCvProjectDocument,
  RemoveCvProjectDocument,
} from "@/graphql/__generated__/graphql";
import { notify } from "@/shared/components/ui/toast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  filterAndSortProjects,
  type CvProjectItem,
  type ProjectSortField,
  type ProjectSortOrder,
} from "../lib/cv-projects.utils";
import type { CvProjectFormData } from "../schemas/cv-project.schema";

export function useCvProjects(cvId: string) {
  const { currentUser } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<ProjectSortField>("name");
  const [sortOrder, setSortOrder] = useState<ProjectSortOrder>("asc");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<CvProjectItem | null>(
    null,
  );
  const [deletingProject, setDeletingProject] = useState<CvProjectItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, loading } = useQuery(CvProjectsDocument, {
    variables: { cvId },
    skip: !cvId,
    errorPolicy: "all",
  });

  const { data: availData } = useQuery(AvailableProjectsDocument, {
    variables: { params: { limit: 100 } },
    errorPolicy: "ignore",
  });

  const [addProjectMutation] = useMutation(AddCvProjectDocument, {
    refetchQueries: [{ query: CvProjectsDocument, variables: { cvId } }],
  });

  const [updateProjectMutation] = useMutation(UpdateCvProjectDocument, {
    refetchQueries: [{ query: CvProjectsDocument, variables: { cvId } }],
  });

  const [removeProjectMutation] = useMutation(RemoveCvProjectDocument, {
    refetchQueries: [{ query: CvProjectsDocument, variables: { cvId } }],
  });

  const cv = data?.cv;
  const isOwner = Boolean(
    currentUser?.id &&
    cv?.user?.id &&
    String(currentUser.id) === String(cv.user.id),
  );

  const rawProjects: CvProjectItem[] = useMemo(() => {
    if (!cv?.projects) return [];
    return cv.projects.map((p) => ({
      id: p.id,
      name: p.name,
      internal_name: p.internal_name,
      domain: p.domain,
      start_date: p.start_date,
      end_date: p.end_date,
      description: p.description,
      environment: p.environment,
      roles: p.roles,
      responsibilities: p.responsibilities,
      project: p.project
        ? { id: p.project.id, name: p.project.name }
        : undefined,
    }));
  }, [cv]);

  const projects = useMemo(
    () => filterAndSortProjects(rawProjects, search, sortField, sortOrder),
    [rawProjects, search, sortField, sortOrder],
  );

  const availableProjects = useMemo(() => {
    return (availData?.projects?.items || []).map((p) => ({
      id: p.id,
      name: p.name,
      domain: p.domain,
      description: p.description,
      environment: p.environment,
      start_date: p.start_date,
      end_date: p.end_date,
    }));
  }, [availData]);

  const handleSort = (field: ProjectSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSave = async (formData: CvProjectFormData) => {
    try {
      if (editingProject) {
        const projectId = editingProject.project?.id || editingProject.id;
        await updateProjectMutation({
          variables: {
            project: {
              cvId,
              projectId,
              start_date: formData.start_date,
              end_date: formData.end_date,
              roles: formData.roles || [],
              responsibilities: formData.responsibilities || [],
            },
          },
        });
        notify.success("Project updated successfully!");
        setEditingProject(null);
      } else {
        await addProjectMutation({
          variables: {
            project: {
              cvId,
              projectId: formData.projectId,
              start_date: formData.start_date,
              end_date: formData.end_date,
              roles: formData.roles || [],
              responsibilities: formData.responsibilities || [],
            },
          },
        });
        notify.success("Project added to CV!");
        setIsAddOpen(false);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save project.";
      notify.error(msg, "Error");
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    try {
      const projectId = deletingProject.project?.id || deletingProject.id;
      await removeProjectMutation({
        variables: { project: { cvId, projectId } },
      });
      notify.success("Project removed from CV!");
      setDeletingProject(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to remove project.";
      notify.error(msg, "Error");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    cv,
    loading,
    isOwner,
    search,
    setSearch,
    sortField,
    sortOrder,
    handleSort,
    projects,
    availableProjects,
    isAddOpen,
    setIsAddOpen,
    editingProject,
    setEditingProject,
    deletingProject,
    setDeletingProject,
    isDeleting,
    handleSave,
    handleConfirmDelete,
  };
}
