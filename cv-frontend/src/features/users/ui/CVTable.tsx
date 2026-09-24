"use client";

import { useState, useMemo, Fragment } from "react";
import { Search, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  CvsDocument,
  CreateCvDocument,
  UpdateCvDocument,
  DeleteCvDocument,
  type CvsQuery,
} from "@/graphql/__generated__/graphql";
import { DropdownMenuButton } from "./DropDownButton";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/ui/toast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { CVDialog } from "@/features/cvs/ui/CVDialog";
import { DeleteCVDialog } from "@/features/cvs/ui/DeleteCVDialog";
import type { CvFormData } from "../schemas/cv.schema";

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

const fallbackCvs: CVItem[] = [
  {
    id: "1",
    name: "Full Stack Engineer",
    education: "Bachelor of Science in Computer Science",
    description:
      "Highly motivated and experienced Software Engineer with 5+ years of proven success in leading and developing robust and scalable applications. Adept at leveraging React, Node.js, Three.js, and WebGL to create innovative and visually appealing user interfaces.",
    user: {
      id: "u1",
      email: "john.doe@example.com",
      profile: {
        first_name: "John",
        last_name: "Doe",
      },
    },
  },
];

type SortField = "name" | "education" | "employee";
type SortOrder = "asc" | "desc";

export interface CVTableProps {
  initialCvs?: CVItem[];
  isOwner?: boolean;
}

export function CVTable({ initialCvs }: CVTableProps = {}) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { currentUserId } = useCurrentUser();

  const { data, refetch } = useQuery<CvsQuery>(CvsDocument, {
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

  const rawCvs: CVItem[] = useMemo(() => {
    if (data?.cvs?.items && data.cvs.items.length > 0) {
      return data.cvs.items.map((c) => ({
        id: c.id,
        name: c.name,
        education: c.education || null,
        description: c.description,
        user: c.user
          ? {
              id: c.user.id,
              email: c.user.email,
              profile: c.user.profile
                ? {
                    first_name: c.user.profile.first_name,
                    last_name: c.user.profile.last_name,
                    avatar: c.user.profile.avatar,
                  }
                : null,
            }
          : null,
      }));
    }
    return initialCvs || fallbackCvs;
  }, [data, initialCvs]);

  const filteredCvs = useMemo(() => {
    let result = [...rawCvs];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((cv) => {
        const name = (cv.name || "").toLowerCase();
        const edu = (cv.education || "").toLowerCase();
        const desc = (cv.description || "").toLowerCase();
        const emp =
          `${cv.user?.profile?.first_name || ""} ${cv.user?.profile?.last_name || ""} ${cv.user?.email || ""}`.toLowerCase();
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
        valA =
          `${a.user?.profile?.first_name || ""} ${a.user?.profile?.last_name || ""}`.toLowerCase();
        valB =
          `${b.user?.profile?.first_name || ""} ${b.user?.profile?.last_name || ""}`.toLowerCase();
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
    setDialogState({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEdit = (cv: CVItem) => {
    setDialogState({
      isOpen: true,
      data: {
        id: cv.id,
        name: cv.name,
        education: cv.education || "",
        description: cv.description,
      },
    });
  };

  const handleOpenDelete = (cv: CVItem) => {
    setDeleteDialogState({
      isOpen: true,
      data: cv,
    });
  };

  const handleSaveCv = async (formData: CvFormData & { id?: string }) => {
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
        await createCvMutation({
          variables: {
            cv: {
              name: formData.name,
              education: formData.education || undefined,
              description: formData.description,
              userId: currentUserId || undefined,
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

  const getEmployeeDisplay = (cv: CVItem) => {
    if (cv.user?.profile?.first_name || cv.user?.profile?.last_name) {
      return `${cv.user.profile.first_name || ""} ${cv.user.profile.last_name || ""}`.trim();
    }
    if (cv.user?.email) {
      return cv.user.email;
    }
    return "Unknown Employee";
  };

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-1">
        <div className="relative w-full max-w-search">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cv-muted dark:text-zinc-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search CVs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-cv-border dark:border-zinc-700 bg-transparent text-base leading-cv-input text-cv-text dark:text-zinc-100 placeholder:text-cv-placeholder focus:outline-hidden focus:border-cv-text dark:focus:border-zinc-400 transition-colors"
            aria-label="Search CVs"
          />
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white text-xs px-4 h-8 uppercase font-medium tracking-wider shadow-cv-button transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create CV</span>
          </Button>
        </div>
      </div>

      <div className=" overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-table-header border-b border-zinc-200 dark:border-zinc-800 bg-transparent">
              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
                >
                  <span>Name</span>
                  {sortField === "name" &&
                    (sortOrder === "asc" ? (
                      <ChevronDown className="h-4 w-4 text-cv-muted" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-cv-muted" />
                    ))}
                </button>
              </th>

              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("education")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
                >
                  <span>Education</span>
                  {sortField === "education" &&
                    (sortOrder === "asc" ? (
                      <ChevronDown className="h-4 w-4 text-cv-muted" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-cv-muted" />
                    ))}
                </button>
              </th>

              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("employee")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
                >
                  <span>Employee</span>
                  {sortField === "employee" &&
                    (sortOrder === "asc" ? (
                      <ChevronDown className="h-4 w-4 text-cv-muted" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-cv-muted" />
                    ))}
                </button>
              </th>

              <th className="w-18 px-4" aria-label="Actions" />
            </tr>
          </thead>

          <tbody>
            {filteredCvs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-cv-muted dark:text-zinc-400"
                >
                  No CVs found. Click &ldquo;Create CV&rdquo; to add one.
                </td>
              </tr>
            ) : (
              filteredCvs.map((cv, index) => (
                <Fragment key={cv.id}>
                  <tr
                    className={`h-table-row hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${
                      index > 0
                        ? "border-t border-zinc-200 dark:border-zinc-800"
                        : ""
                    }`}
                  >
                    <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100">
                      {cv.name || ""}
                    </td>

                    <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100">
                      {cv.education || ""}
                    </td>

                    <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100 truncate max-w-email">
                      {getEmployeeDisplay(cv)}
                    </td>

                    <td className="px-4 text-right">
                      <DropdownMenuButton
                        id={cv.id}
                        viewHref={`/cvs/${cv.id}`}
                        onUpdate={() => handleOpenEdit(cv)}
                        onDelete={() => handleOpenDelete(cv)}
                      />
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors border-t-0">
                    <td colSpan={4} className="px-4 py-2 border-t-0">
                      <div className="font-roboto text-sm leading-5 tracking-cv text-cv-text/50 dark:text-zinc-100">
                        {cv.description}
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CVDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, data: null })}
        onSave={handleSaveCv}
        onDelete={(id, name) => {
          setDeleteDialogState({
            isOpen: true,
            data: { id, name: name || "", description: "" },
          });
        }}
        initialData={dialogState.data}
      />

      <DeleteCVDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, data: null })}
        onConfirm={handleConfirmDelete}
        cvName={deleteDialogState.data?.name}
      />
    </div>
  );
}
