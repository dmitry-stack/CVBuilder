"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { notify } from "@/components/ui/toast";
import { HeaderSync } from "@/components/layout/HeaderContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  CvDocument,
  CvsDocument,
  UpdateCvDocument,
} from "@/graphql/__generated__/graphql";
import { cvFormSchema, type CvFormData } from "../../schemas/cv.schema";
import { CVDetailsSkeleton } from "./CVDetailsSkeleton";
import { useTranslation } from "@/i18n";

interface CVDetailsViewProps {
  cvId: string;
}

export function CVDetailsView({ cvId }: CVDetailsViewProps) {
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();

  const { data, loading } = useQuery(CvDocument, {
    variables: { cvId },
    skip: !cvId,
    errorPolicy: "all",
  });

  const [updateCv] = useMutation(UpdateCvDocument, {
    refetchQueries: [
      { query: CvDocument, variables: { cvId } },
      { query: CvsDocument },
    ],
  });

  const cv = data?.cv;
  const isOwner = Boolean(
    currentUser?.id &&
    cv?.user?.id &&
    String(currentUser.id) === String(cv.user.id),
  );

  const defaultValues = useMemo<CvFormData>(
    () => ({
      name: cv?.name || "",
      education: cv?.education || "",
      description: cv?.description || "",
    }),
    [cv],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CvFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (cv) {
      reset({
        name: cv.name,
        education: cv.education || "",
        description: cv.description,
      });
    }
  }, [cv, reset]);

  const onSubmit = async (formData: CvFormData) => {
    try {
      await updateCv({
        variables: {
          cv: {
            cvId,
            name: formData.name,
            education: formData.education || undefined,
            description: formData.description,
          },
        },
      });
      notify.success("CV updated successfully!");
      reset(formData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update CV";
      notify.error(msg, "Error");
    }
  };

  if (loading && !cv) {
    return <CVDetailsSkeleton />;
  }

  return (
    <div
      data-slot="cv-details-view"
      data-testid="cv-details-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto"
    >
      {cv?.name && <HeaderSync userName={cv.name} />}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl space-y-5"
      >
        <div>
          <label
            htmlFor="cv_name"
            className="block text-xs font-normal text-[#757575] dark:text-zinc-400 mb-1.5 font-roboto"
          >
            {t("common.name")}
          </label>
          <input
            id="cv_name"
            type="text"
            disabled={!isOwner}
            aria-invalid={Boolean(errors.name)}
            placeholder={t("cvDetails.namePlaceholder")}
            {...register("name")}
            className="w-full h-12 px-4 border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-sm sm:text-base text-[#2E2E2E] dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          />
          {errors.name && (
            <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cv_education"
            className="block text-xs font-normal text-[#757575] dark:text-zinc-400 mb-1.5 font-roboto"
          >
            {t("cvs.education")}
          </label>
          <input
            id="cv_education"
            type="text"
            disabled={!isOwner}
            aria-invalid={Boolean(errors.education)}
            placeholder={t("cvDetails.educationPlaceholder")}
            {...register("education")}
            className="w-full h-12 px-4 border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-sm sm:text-base text-[#2E2E2E] dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          />
          {errors.education && (
            <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.education.message}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cv_description"
            className="block text-xs font-normal text-[#757575] dark:text-zinc-400 mb-1.5 font-roboto"
          >
            {t("common.description")}
          </label>
          <textarea
            id="cv_description"
            rows={6}
            disabled={!isOwner}
            aria-invalid={Boolean(errors.description)}
            placeholder={t("cvDetails.descriptionPlaceholder")}
            {...register("description")}
            className="w-full min-h-[160px] p-4 border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-sm sm:text-base leading-relaxed text-[#2E2E2E] dark:text-zinc-100 font-roboto focus:outline-hidden focus:ring-1 focus:ring-cv-accent transition-colors disabled:opacity-75 disabled:cursor-not-allowed resize-y"
          />
          {errors.description && (
            <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.description.message}</span>
            </p>
          )}
        </div>

        {isOwner && (
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="rounded-full min-w-[140px] px-8 h-10 font-roboto text-sm font-medium uppercase tracking-wider text-white transition-colors disabled:bg-[#AEAEAE] disabled:cursor-not-allowed bg-cv-accent hover:bg-cv-accent-hover shadow-cv-button cursor-pointer focus:outline-hidden"
            >
              {isSubmitting ? t("common.updating") : t("common.update")}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
