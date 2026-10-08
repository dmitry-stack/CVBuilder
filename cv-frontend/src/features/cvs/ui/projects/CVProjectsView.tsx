"use client";

import { HeaderSync } from "@/components/layout/HeaderContext";
import { useCvProjects } from "../../hooks/useCvProjects";
import { CVProjectsHeader } from "./CVProjectsHeader";
import { CVProjectsList } from "./CVProjectsList";
import { CVProjectDialog } from "./CVProjectDialog";
import { DeleteCVProjectDialog } from "./DeleteCVProjectDialog";
import { CVProjectsSkeleton } from "./CVProjectsSkeleton";

interface CVProjectsViewProps {
  cvId: string;
}

export function CVProjectsView({ cvId }: CVProjectsViewProps) {
  const {
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
  } = useCvProjects(cvId);

  if (loading && !cv) {
    return <CVProjectsSkeleton />;
  }

  return (
    <div
      data-slot="cv-projects-view"
      data-testid="cv-projects-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto space-y-6"
    >
      <HeaderSync userName={cv?.name} entityId={cvId} />

      <CVProjectsHeader
        search={search}
        onSearchChange={setSearch}
        isOwner={isOwner}
        onAddClick={() => setIsAddOpen(true)}
      />

      <CVProjectsList
        projects={projects}
        isOwner={isOwner}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEdit={(p) => setEditingProject(p)}
        onDelete={(p) => setDeletingProject(p)}
        onAddClick={() => setIsAddOpen(true)}
      />

      <CVProjectDialog
        isOpen={isAddOpen || Boolean(editingProject)}
        initialData={editingProject}
        availableProjects={availableProjects}
        onClose={() => {
          setIsAddOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSave}
      />

      <DeleteCVProjectDialog
        isOpen={Boolean(deletingProject)}
        projectName={deletingProject?.name}
        isDeleting={isDeleting}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
