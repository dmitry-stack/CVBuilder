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
import { notify } from "@/shared/components/ui/toast";

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

  const getPageStyles = (): string => {
    let cssText = "";
    try {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          if (sheet.cssRules) {
            for (const rule of Array.from(sheet.cssRules)) {
              cssText += rule.cssText + "\n";
            }
          }
        } catch (e) {
          console.warn("Could not read stylesheet rules:", e);
        }
      }
    } catch (err) {
      console.error("Error gathering stylesheets:", err);
    }
    return cssText;
  };

  const handleExportPdf = async () => {
    if (!cv) return;
    setIsExporting(true);

    try {
      const container = document.getElementById("cv-preview-content");
      if (!container) return;

      const clone = container.cloneNode(true) as HTMLElement;
      clone
        .querySelectorAll("[data-no-export], [data-no-print], button")
        .forEach((el) => el.remove());
      const htmlContent = clone.outerHTML;

      const activeStyles = getPageStyles();

      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${cv.name || "CV"}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');
              * {
                font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                box-sizing: border-box;
              }
              body {
                background: #ffffff !important;
                color: #2e2e2e !important;
              }
              [data-no-export], [data-no-print], button {
                display: none !important;
              }

              /* Preserve two-column layout and red vertical dividers in PDF export */
              .cv-preview-two-col {
                display: flex !important;
                flex-direction: row !important;
                gap: 2rem !important;
              }
              .cv-preview-col-left {
                width: 32% !important;
                flex-shrink: 0 !important;
              }
              .cv-preview-col-right {
                width: 68% !important;
                padding-left: 1.5rem !important;
                border-left: 2px solid #E57373 !important;
              }

              /* Table red dividers in PDF */
              table thead tr {
                border-bottom: 2px solid #E57373 !important;
              }
              table tbody tr {
                border-bottom: 1px solid rgba(229, 115, 115, 0.4) !important;
              }

              ${activeStyles}
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
