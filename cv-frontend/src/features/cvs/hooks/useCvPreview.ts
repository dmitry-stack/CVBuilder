"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  CvPreviewDocument,
  ExportPdfDocument,
  SkillCategoriesDocument,
} from "@/graphql/__generated__/graphql";
import {
  extractUniqueDomains,
  base64ToBlob,
  downloadBlob,
} from "../lib/cv-preview.utils";
import { groupSkillsByCategory, type SkillItem } from "../lib/cv-skills.utils";
import { notify } from "@/components/ui/toast";

export function useCvPreview(cvId: string) {
  const [isExporting, setIsExporting] = useState(false);

  const { data, loading, error } = useQuery(CvPreviewDocument, {
    variables: { cvId },
    skip: !cvId,
    errorPolicy: "all",
  });

  const { data: categoriesData } = useQuery(SkillCategoriesDocument, {
    errorPolicy: "all",
  });

  const [exportPdfMutation] = useMutation(ExportPdfDocument);

  const cv = data?.cv;
  const user = cv?.user;
  const profile = user?.profile;
  const projects = cv?.projects || [];

  const employeeName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "Employee";

  const employeePosition =
    user?.position?.name?.toUpperCase() || "SOFTWARE ENGINEER";

  const domains = extractUniqueDomains(projects);

  const rawSkills: SkillItem[] = (cv?.skills || []).map((s) => ({
    name: s.name,
    categoryId: s.categoryId,
    mastery: s.mastery,
  }));

  const categories = categoriesData?.skillCategories || [];
  const skillsGrouped = groupSkillsByCategory(rawSkills, categories);

  const languages = cv?.languages?.length
    ? cv.languages
    : profile?.languages || [];

  const handleExportPdf = async () => {
    if (!cv) return;
    setIsExporting(true);

    try {
      const container = document.getElementById("cv-preview-content");
      const htmlContent = container ? container.outerHTML : "";

      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${cv.name || "CV"}</title>
            <style>
              body { font-family: Roboto, sans-serif; margin: 0; padding: 24px; color: #18181b; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;

      const response = await exportPdfMutation({
        variables: {
          pdf: {
            html: fullHtml,
            margin: {
              top: "20px",
              bottom: "20px",
              left: "20px",
              right: "20px",
            },
          },
        },
      });

      const base64Data = response.data?.exportPdf;
      if (base64Data) {
        const blob = base64ToBlob(base64Data);
        downloadBlob(blob, `${cv.name || "CV"}.pdf`);
        notify.success("PDF exported successfully!");
      } else {
        window.print();
        notify.info("Print dialog opened for PDF export.");
      }
    } catch {
      window.print();
      notify.info("Print dialog opened for PDF export.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    cv,
    user,
    profile,
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
  };
}
