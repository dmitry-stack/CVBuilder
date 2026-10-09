"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { notify } from "@/shared/components/ui/toast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { CvFormData } from "../schemas/cv.schema";
import {
  CvsDocument,
  CreateCvDocument,
  UpdateCvDocument,
  DeleteCvDocument,
} from "@/graphql/__generated__/graphql";

export interface CVItem {
  id: string;
  name: string;
  education?: string | null;
  description: string;
  user?: {
    id: string;
    email: string;
    profile?: {
      first_name?: string | null;
      last_name?: string | null;
      avatar?: string | null;
    } | null;
  } | null;
}

export type SortField = "name" | "education" | "employee";
export type SortOrder = "asc" | "desc";

export interface UseCvsTableProps {
  initialCvs?: CVItem[];
  isOwner?: boolean;
  userId?: string;
}

export function useCvsTable({
  initialCvs,
  isOwner: propIsOwner,
  userId,
}: UseCvsTableProps = {}) {
  const { currentUserId } = useCurrentUser();
  const isOwner =
    typeof propIsOwner === "boolean"
      ? propIsOwner
      : userId
        ? currentUserId === userId
        : true;

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    data: (CvFormData & { id?: string }) | null;
  }>({
    isOpen: false,
    data: null,
  });

  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    data: CVItem | null;
  }>({
    isOpen: false,
    data: null,
  });

  const { data, refetch } = useQuery(CvsDocument, {
    variables: {
      params: {
        search: search || undefined,
        sort_by: sortField === "employee" ? "name" : sortField,
        sort_order: sortOrder,
        page: 1,
        limit: 50,
      },
    },
    errorPolicy: "ignore",
  });

  const [createCvMutation] = useMutation(CreateCvDocument, {
    refetchQueries: [{ query: CvsDocument }],
  });

  const [updateCvMutation] = useMutation(UpdateCvDocument, {
    refetchQueries: [{ query: CvsDocument }],
  });

  const [deleteCvMutation] = useMutation(DeleteCvDocument, {
    refetchQueries: [{ query: CvsDocument }],
  });

  const rawCvs: CVItem[] = useMemo(() => {
    let items: CVItem[] = [];
    if (data?.cvs?.items && data.cvs.items.length > 0) {
      items = data.cvs.items.map((c) => ({
        id: c.id,
        name: c.name,
        education: c.education || null,
        description: c.description,
        user: c.user
          ? {
              id: c.user.id,
              email: c.user.email,
            }
          : null,
      }));
    } else if (initialCvs) {
      items = initialCvs;
    }

    if (userId) {
      items = items.filter((c) => c.user?.id === userId);
    }
    return items;
  }, [data, initialCvs, userId]);

  const filteredCvs = useMemo(() => {
    let result = [...rawCvs];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((cv) => {
        const name = (cv.name || "").toLowerCase();
        const edu = (cv.education || "").toLowerCase();
        const desc = (cv.description || "").toLowerCase();
        const emp = (cv.user?.email || "").toLowerCase();
        return (
          name.includes(q) ||
          edu.includes(q) ||
          desc.includes(q) ||
          emp.includes(q)
        );
      });
    }

    result.sort((a, b) => {
      let valA = "";
      let valB = "";

      if (sortField === "name") {
        valA = (a.name || "").toLowerCase();
        valB = (b.name || "").toLowerCase();
      } else if (sortField === "education") {
        valA = (a.education || "").toLowerCase();
        valB = (b.education || "").toLowerCase();
      } else if (sortField === "employee") {
        valA = (a.user?.email || "").toLowerCase();
        valB = (b.user?.email || "").toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [rawCvs, search, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleOpenCreate = () => {
    setDialogState({ isOpen: true, data: null });
  };

  const handleOpenEdit = (cvItem: CVItem) => {
    setDialogState({
      isOpen: true,
      data: {
        id: cvItem.id,
        name: cvItem.name,
        education: cvItem.education || "",
        description: cvItem.description,
      },
    });
  };

  const handleSave = async (formData: CvFormData & { id?: string }) => {
    try {
      if (formData.id) {
        await updateCvMutation({
          variables: {
            cv: {
              cvId: formData.id,
              name: formData.name,
              education: formData.education || undefined,
              description: formData.description,
            },
          },
        });
        notify.success(`CV "${formData.name}" updated successfully!`);
      } else {
        if (!currentUserId) {
          notify.error("User session is not ready. Please try again.");
          return;
        }
        await createCvMutation({
          variables: {
            cv: {
              name: formData.name,
              education: formData.education || undefined,
              description: formData.description,
              userId: userId || currentUserId,
            },
          },
        });
        notify.success(`CV "${formData.name}" created successfully!`);
      }
      refetch?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save CV.";
      notify.error(message);
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialogState.data?.id) return;
    try {
      await deleteCvMutation({
        variables: {
          cv: {
            cvId: deleteDialogState.data.id,
          },
        },
      });
      notify.success(
        `CV "${deleteDialogState.data.name}" deleted successfully!`,
      );
      refetch?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete CV.";
      notify.error(message);
      throw err;
    }
  };

  return {
    isOwner,
    search,
    setSearch,
    sortField,
    sortOrder,
    handleSort,
    filteredCvs,
    dialogState,
    setDialogState,
    deleteDialogState,
    setDeleteDialogState,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleConfirmDelete,
  };
}
