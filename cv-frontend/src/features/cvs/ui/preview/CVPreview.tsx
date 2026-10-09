"use client";

import { AlertCircle } from "lucide-react";
import { HeaderSync } from "@/shared/components/layout/HeaderContext";
import { useCvPreview } from "../../hooks/useCvPreview";
import { CVPreviewHeader } from "./CVPreviewHeader";
import { CVPreviewSummary } from "./CVPreviewSummary";
import { CVPreviewProjects } from "./CVPreviewProjects";
import { CVPreviewSkills } from "./CVPreviewSkills";
import { CVPreviewSkeleton } from "./CVPreviewSkeleton";
import { useDelayedLoading } from "@/shared/lib/hooks/useDelayedLoading";

interface CVPreviewProps {
  cvId: string;
}

export function CVPreview({ cvId }: CVPreviewProps) {
  const {
    cv,
    projects,
    domains,
    languages,
    employeeName,
    employeePosition,
    skillsGrouped,
    loading,
    error,
    isExporting,
    handleExportPdf,
  } = useCvPreview(cvId);

  const isInitialLoading = Boolean(loading && !cv);
  const showSkeleton = useDelayedLoading(isInitialLoading);

  if (showSkeleton) {
    return <CVPreviewSkeleton />;
  }

  if (isInitialLoading) {
    return null;
  }

  if (error && !cv) {
    return (
      <div
        role="alert"
        className="w-full py-12 flex flex-col items-center justify-center text-center text-destructive font-roboto"
      >
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-sm font-medium">Failed to load CV preview</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {error.message}
        </p>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="w-full py-12 text-center text-zinc-500 dark:text-zinc-400 font-roboto text-sm">
        CV not found.
      </div>
    );
  }

  return (
    <div
      data-slot="cv-preview-view"
      data-testid="cv-preview-view"
      className="w-full px-32 pt-8 pb-16 font-roboto"
    >
      <HeaderSync userName={cv.name} entityId={cvId} />

      <div id="cv-preview-content" className="space-y-6">
        <CVPreviewHeader
          employeeName={employeeName}
          position={employeePosition}
          isExporting={isExporting}
          onExportPdf={handleExportPdf}
        />

        <CVPreviewSummary
          cvName={cv.name}
          education={cv.education}
          description={cv.description}
          languages={languages}
          domains={domains}
          skillsGrouped={skillsGrouped}
        />

        <CVPreviewProjects projects={projects} />

        <CVPreviewSkills skillsGrouped={skillsGrouped} projects={projects} />
      </div>
    </div>
  );
}
