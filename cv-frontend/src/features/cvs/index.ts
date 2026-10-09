export { CVTable, type CVItem, type CVTableProps } from "./ui/CVTable";
export { CVDialog } from "./ui/CVDialog";
export { CVTabs } from "./ui/CVTabs";
export { DeleteCVDialog } from "./ui/DeleteCVDialog";
export { CVDetailsView } from "./ui/details/CVDetailsView";
export { CVPreview } from "./ui/preview/CVPreview";
export { CVProjectsView } from "./ui/projects/CVProjectsView";
export { CVSkillsView } from "./ui/skills/CVSkillsView";

export { useCvsTable } from "./hooks/useCvsTable";
export { useCvProjects } from "./hooks/useCvProjects";
export { useCvSkills } from "./hooks/useCvSkills";

export {
  cvFormSchema,
  createCvSchema,
  updateCvSchema,
  type CvFormData,
  type CreateCvFormData,
  type UpdateCvFormData,
} from "./schemas/cv.schema";
export {
  cvProjectFormSchema,
  type CvProjectFormData,
} from "./schemas/cv-project.schema";
export {
  cvSkillFormSchema,
  type CvSkillFormData,
} from "./schemas/cv-skill.schema";
