"use client";

import { Loader2 } from "lucide-react";

interface CVPreviewHeaderProps {
  employeeName: string;
  position: string;
  isExporting: boolean;
  onExportPdf: () => void;
}

export function CVPreviewHeader({
  employeeName,
  position,
  isExporting,
  onExportPdf,
}: CVPreviewHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-medium text-zinc-900 dark:text-zinc-100 font-roboto tracking-tight">
          {employeeName}
        </h1>
        <p className="text-xs sm:text-sm font-medium tracking-[0.15em] text-zinc-500 dark:text-zinc-400 mt-1 uppercase font-roboto">
          {position}
        </p>
      </div>

      <button
        type="button"
        data-no-export
        onClick={onExportPdf}
        disabled={isExporting}
        aria-label="Export PDF"
        className="print:hidden self-start sm:self-center inline-flex items-center justify-center gap-2 rounded-full border border-cv-accent text-cv-accent hover:bg-cv-accent/5 active:bg-cv-accent/10 px-6 py-2 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <span>Export PDF</span>
        )}
      </button>
    </div>
  );
}
