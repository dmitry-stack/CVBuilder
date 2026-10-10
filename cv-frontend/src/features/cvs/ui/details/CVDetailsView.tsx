"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useQuery, useMutation } from "@apollo/client/react";
import { notify } from "@/shared/components/ui/toast";
import { HeaderSync } from "@/shared/components/layout/HeaderContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  CvDocument,
  CvsDocument,
  UpdateCvDocument,
} from "@/graphql/__generated__/graphql";
import { cvFormSchema, type CvFormData } from "../../schemas/cv.schema";
import { CVDetailsSkeleton } from "./CVDetailsSkeleton";
import { useDelayedLoading } from "@/shared/lib/hooks/useDelayedLoading";
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

  const isInitialLoading = Boolean(loading && !cv);
  const showSkeleton = useDelayedLoading(isInitialLoading);

  if (showSkeleton) {
    return <CVDetailsSkeleton />;
  }

  if (isInitialLoading) {
    return null;
  }

  return (
    <div
      data-slot="cv-details-view"
      data-testid="cv-details-view"
      className="w-full pt-4 sm:pt-6 pb-16 font-roboto"
    >
      <HeaderSync userName={cv?.name} entityId={cvId} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl space-y-5"
      >
        <Input
          id="cv_name"
          label={t("common.name")}
          alwaysShowLabel
          disabled={!isOwner}
          placeholder={t("cvDetails.namePlaceholder")}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="cv_education"
          label={t("cvs.education")}
          alwaysShowLabel
          disabled={!isOwner}
          placeholder={t("cvDetails.educationPlaceholder")}
          error={errors.education?.message}
          {...register("education")}
        />

        <Textarea
          id="cv_description"
          label={t("common.description")}
          alwaysShowLabel
          rows={6}
          disabled={!isOwner}
          placeholder={t("cvDetails.descriptionPlaceholder")}
          error={errors.description?.message}
          className="min-h-[160px]"
          {...register("description")}
        />

        {isOwner && (
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={!isDirty || isSubmitting}
              className="min-w-35 shadow-cv-button"
            >
              {isSubmitting ? t("common.updating") : t("common.update")}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
