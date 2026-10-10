/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type AddCvProjectInput = {
  cvId: string | number;
  end_date?: string | null | undefined;
  projectId: string | number;
  responsibilities: Array<string>;
  roles: Array<string>;
  start_date: string;
};

export type AddCvSkillInput = {
  categoryId?: string | number | null | undefined;
  cvId: string | number;
  mastery: Mastery;
  name: string;
};

export type AddProfileLanguageInput = {
  name: string;
  proficiency: Proficiency;
  userId: string | number;
};

export type AddProfileSkillInput = {
  categoryId?: string | number | null | undefined;
  mastery: Mastery;
  name: string;
  userId: string | number;
};

export type AuthInput = {
  email: string;
  password: string;
};

export type ChangePasswordInput = {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
};

export type CreateCvInput = {
  description: string;
  education?: string | null | undefined;
  name: string;
  userId?: string | number | null | undefined;
};

export type DeleteAvatarInput = {
  userId: string | number;
};

export type DeleteCvInput = {
  cvId: string | number;
};

export type DeleteCvSkillInput = {
  cvId: string | number;
  name: Array<string>;
};

export type DeleteProfileLanguageInput = {
  name: Array<string>;
  userId: string | number;
};

export type DeleteProfileSkillInput = {
  name: Array<string>;
  userId: string | number;
};

export type ExportPdfInput = {
  html: string;
  margin?: MarginInput | null | undefined;
};

export type ForgotPasswordInput = {
  email: string;
};

export type MarginInput = {
  bottom: string;
  left: string;
  right: string;
  top: string;
};

export type Mastery =
  "Advanced" | "Competent" | "Expert" | "Novice" | "Proficient";

export type Proficiency = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export type RemoveCvProjectInput = {
  cvId: string | number;
  projectId: string | number;
};

export type ResetPasswordInput = {
  confirmPassword: string;
  newPassword: string;
};

export type SearchPaginationInput = {
  limit?: number | null | undefined;
  page?: number | null | undefined;
  search?: string | null | undefined;
  sort_by?: string | null | undefined;
  sort_order?: string | null | undefined;
};

export type SignupInput = {
  confirmPassword: string;
  email: string;
  password: string;
};

export type UpdateCvInput = {
  cvId: string | number;
  description: string;
  education?: string | null | undefined;
  name: string;
};

export type UpdateCvProjectInput = {
  cvId: string | number;
  end_date?: string | null | undefined;
  projectId: string | number;
  responsibilities: Array<string>;
  roles: Array<string>;
  start_date: string;
};

export type UpdateCvSkillInput = {
  categoryId?: string | number | null | undefined;
  cvId: string | number;
  mastery: Mastery;
  name: string;
};

export type UpdateProfileInput = {
  first_name?: string | null | undefined;
  last_name?: string | null | undefined;
  userId: string | number;
};

export type UpdateProfileLanguageInput = {
  name: string;
  proficiency: Proficiency;
  userId: string | number;
};

export type UpdateProfileSkillInput = {
  categoryId?: string | number | null | undefined;
  mastery: Mastery;
  name: string;
  userId: string | number;
};

export type UpdateUserInput = {
  departmentId: string | number;
  positionId: string | number;
  role: UserRole;
  userId: string | number;
};

export type UploadAvatarInput = {
  base64: string;
  size: number;
  type: string;
  userId: string | number;
};

export type UserRole = "Admin" | "Employee";

export type VerifyMailInput = {
  otp: string;
};

export type LoginMutationVariables = Exact<{
  auth: AuthInput;
}>;

export type LoginMutation = {
  login: {
    access_token: string;
    refresh_token: string;
    user: { id: string; email: string };
  };
};

export type SignupMutationVariables = Exact<{
  auth: SignupInput;
}>;

export type SignupMutation = {
  signup: {
    access_token: string;
    refresh_token: string;
    user: { id: string; email: string };
  };
};

export type UpdateTokenMutationVariables = Exact<{ [key: string]: never }>;

export type UpdateTokenMutation = {
  updateToken: { access_token: string; refresh_token: string };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  me: {
    id: string;
    email: string | null;
    role: UserRole | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
  };
};

export type ForgotPasswordMutationVariables = Exact<{
  auth: ForgotPasswordInput;
}>;

export type ForgotPasswordMutation = { forgotPassword: unknown };

export type ResetPasswordMutationVariables = Exact<{
  auth: ResetPasswordInput;
}>;

export type ResetPasswordMutation = { resetPassword: unknown };

export type VerifyMailMutationVariables = Exact<{
  mail: VerifyMailInput;
}>;

export type VerifyMailMutation = { verifyMail: unknown };

export type SendVerificationMutationVariables = Exact<{
  email: string;
}>;

export type SendVerificationMutation = { sendVerification: unknown };

export type CvPreviewQueryVariables = Exact<{
  cvId: string | number;
}>;

export type CvPreviewQuery = {
  cv: {
    id: string;
    created_at: string;
    name: string;
    education: string | null;
    description: string;
    user: {
      id: string;
      email: string;
      position: { id: string; name: string } | null;
      department: { id: string; name: string } | null;
      profile: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        full_name: string | null;
        avatar: string | null;
        languages: Array<{ name: string; proficiency: Proficiency }>;
        skills: Array<{
          name: string;
          categoryId: string | null;
          mastery: Mastery;
        }>;
      };
    } | null;
    languages: Array<{ name: string; proficiency: Proficiency }>;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
    projects: Array<{
      id: string;
      name: string;
      internal_name: string;
      domain: string;
      start_date: string;
      end_date: string | null;
      description: string;
      environment: Array<string>;
      roles: Array<string>;
      responsibilities: Array<string>;
      project: { id: string; name: string };
    }> | null;
  };
};

export type ExportPdfMutationVariables = Exact<{
  pdf: ExportPdfInput;
}>;

export type ExportPdfMutation = { exportPdf: string };

export type CvProjectsQueryVariables = Exact<{
  cvId: string | number;
}>;

export type CvProjectsQuery = {
  cv: {
    id: string;
    name: string;
    user: { id: string } | null;
    projects: Array<{
      id: string;
      name: string;
      internal_name: string;
      domain: string;
      start_date: string;
      end_date: string | null;
      description: string;
      environment: Array<string>;
      roles: Array<string>;
      responsibilities: Array<string>;
      project: { id: string; name: string };
    }> | null;
  };
};

export type AvailableProjectsQueryVariables = Exact<{
  params?: SearchPaginationInput | null | undefined;
}>;

export type AvailableProjectsQuery = {
  projects: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    items: Array<{
      id: string;
      name: string;
      domain: string;
      description: string;
      start_date: string;
      end_date: string | null;
      environment: Array<string>;
    }>;
  };
};

export type AddCvProjectMutationVariables = Exact<{
  project: AddCvProjectInput;
}>;

export type AddCvProjectMutation = {
  addCvProject: {
    id: string;
    projects: Array<{
      id: string;
      name: string;
      internal_name: string;
      domain: string;
      start_date: string;
      end_date: string | null;
      description: string;
      environment: Array<string>;
      roles: Array<string>;
      responsibilities: Array<string>;
      project: { id: string; name: string };
    }> | null;
  };
};

export type UpdateCvProjectMutationVariables = Exact<{
  project: UpdateCvProjectInput;
}>;

export type UpdateCvProjectMutation = {
  updateCvProject: {
    id: string;
    projects: Array<{
      id: string;
      name: string;
      internal_name: string;
      domain: string;
      start_date: string;
      end_date: string | null;
      description: string;
      environment: Array<string>;
      roles: Array<string>;
      responsibilities: Array<string>;
      project: { id: string; name: string };
    }> | null;
  };
};

export type RemoveCvProjectMutationVariables = Exact<{
  project: RemoveCvProjectInput;
}>;

export type RemoveCvProjectMutation = {
  removeCvProject: {
    id: string;
    projects: Array<{
      id: string;
      name: string;
      internal_name: string;
      domain: string;
      start_date: string;
      end_date: string | null;
      description: string;
      environment: Array<string>;
      roles: Array<string>;
      responsibilities: Array<string>;
      project: { id: string; name: string };
    }> | null;
  };
};

export type CvSkillsQueryVariables = Exact<{
  cvId: string | number;
}>;

export type CvSkillsQuery = {
  cv: {
    id: string;
    name: string;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
    user: {
      id: string;
      email: string;
      profile: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        avatar: string | null;
        skills: Array<{
          name: string;
          categoryId: string | null;
          mastery: Mastery;
        }>;
      };
    } | null;
  };
};

export type AddCvSkillMutationVariables = Exact<{
  skill: AddCvSkillInput;
}>;

export type AddCvSkillMutation = {
  addCvSkill: {
    id: string;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
  };
};

export type UpdateCvSkillMutationVariables = Exact<{
  skill: UpdateCvSkillInput;
}>;

export type UpdateCvSkillMutation = {
  updateCvSkill: {
    id: string;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
  };
};

export type DeleteCvSkillMutationVariables = Exact<{
  skill: DeleteCvSkillInput;
}>;

export type DeleteCvSkillMutation = {
  deleteCvSkill: {
    id: string;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
  };
};

export type CvsQueryVariables = Exact<{
  params?: SearchPaginationInput | null | undefined;
}>;

export type CvsQuery = {
  cvs: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    items: Array<{
      id: string;
      created_at: string;
      name: string;
      education: string | null;
      description: string;
      user: { id: string; email: string } | null;
    }>;
  };
};

export type CvQueryVariables = Exact<{
  cvId: string | number;
}>;

export type CvQuery = {
  cv: {
    id: string;
    created_at: string;
    name: string;
    education: string | null;
    description: string;
    user: {
      id: string;
      email: string;
      profile: {
        first_name: string | null;
        last_name: string | null;
        avatar: string | null;
      };
    } | null;
  };
};

export type CreateCvMutationVariables = Exact<{
  cv: CreateCvInput;
}>;

export type CreateCvMutation = {
  createCv: {
    id: string;
    created_at: string;
    name: string;
    education: string | null;
    description: string;
    user: { id: string; email: string } | null;
  };
};

export type UpdateCvMutationVariables = Exact<{
  cv: UpdateCvInput;
}>;

export type UpdateCvMutation = {
  updateCv: {
    id: string;
    name: string;
    education: string | null;
    description: string;
  };
};

export type DeleteCvMutationVariables = Exact<{
  cv: DeleteCvInput;
}>;

export type DeleteCvMutation = { deleteCv: { affected: number } };

export type ProfileLanguagesQueryVariables = Exact<{
  userId: string | number;
}>;

export type ProfileLanguagesQuery = {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    languages: Array<{ name: string; proficiency: Proficiency }>;
  };
};

export type LanguagesCatalogQueryVariables = Exact<{
  params?: SearchPaginationInput | null | undefined;
}>;

export type LanguagesCatalogQuery = {
  languages: {
    total: number;
    items: Array<{
      id: string;
      name: string;
      iso2: string;
      native_name: string | null;
    }>;
  };
};

export type AddProfileLanguageMutationVariables = Exact<{
  language: AddProfileLanguageInput;
}>;

export type AddProfileLanguageMutation = {
  addProfileLanguage: {
    id: string;
    languages: Array<{ name: string; proficiency: Proficiency }>;
  };
};

export type UpdateProfileLanguageMutationVariables = Exact<{
  language: UpdateProfileLanguageInput;
}>;

export type UpdateProfileLanguageMutation = {
  updateProfileLanguage: {
    id: string;
    languages: Array<{ name: string; proficiency: Proficiency }>;
  };
};

export type DeleteProfileLanguageMutationVariables = Exact<{
  language: DeleteProfileLanguageInput;
}>;

export type DeleteProfileLanguageMutation = {
  deleteProfileLanguage: {
    id: string;
    languages: Array<{ name: string; proficiency: Proficiency }>;
  };
};

export type UploadAvatarMutationVariables = Exact<{
  avatar: UploadAvatarInput;
}>;

export type UploadAvatarMutation = { uploadAvatar: string };

export type DeleteAvatarMutationVariables = Exact<{
  avatar: DeleteAvatarInput;
}>;

export type DeleteAvatarMutation = { deleteAvatar: unknown };

export type ProfileSkillsQueryVariables = Exact<{
  userId: string | number;
}>;

export type ProfileSkillsQuery = {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
  };
};

export type SkillCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type SkillCategoriesQuery = {
  skillCategories: Array<{
    id: string;
    name: string;
    order: number;
    parent: { id: string; name: string } | null;
  }>;
};

export type SkillsCatalogQueryVariables = Exact<{
  params?: SearchPaginationInput | null | undefined;
}>;

export type SkillsCatalogQuery = {
  skills: {
    total: number;
    items: Array<{
      id: string;
      name: string;
      category: { id: string; name: string };
    }>;
  };
};

export type AddProfileSkillMutationVariables = Exact<{
  skill: AddProfileSkillInput;
}>;

export type AddProfileSkillMutation = {
  addProfileSkill: {
    id: string;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
  };
};

export type UpdateProfileSkillMutationVariables = Exact<{
  skill: UpdateProfileSkillInput;
}>;

export type UpdateProfileSkillMutation = {
  updateProfileSkill: {
    id: string;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
  };
};

export type DeleteProfileSkillMutationVariables = Exact<{
  skill: DeleteProfileSkillInput;
}>;

export type DeleteProfileSkillMutation = {
  deleteProfileSkill: {
    id: string;
    skills: Array<{
      name: string;
      categoryId: string | null;
      mastery: Mastery;
    }>;
  };
};

export type UsersQueryVariables = Exact<{
  params?: SearchPaginationInput | null | undefined;
}>;

export type UsersQuery = {
  users: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    items: Array<{
      id: string;
      email: string;
      profile: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        avatar: string | null;
      };
      department: { id: string; name: string } | null;
      position: { id: string; name: string } | null;
    }>;
  };
};

export type UserQueryVariables = Exact<{
  userId: string | number;
}>;

export type UserQuery = {
  user: {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
    profile: {
      id: string;
      first_name: string | null;
      last_name: string | null;
      full_name: string | null;
      avatar: string | null;
    };
    department: { id: string; name: string } | null;
    position: { id: string; name: string } | null;
  };
};

export type DepartmentsQueryVariables = Exact<{ [key: string]: never }>;

export type DepartmentsQuery = {
  departments: { items: Array<{ id: string; name: string }> };
};

export type PositionsQueryVariables = Exact<{ [key: string]: never }>;

export type PositionsQuery = {
  positions: { items: Array<{ id: string; name: string }> };
};

export type UpdateProfileMutationVariables = Exact<{
  profile: UpdateProfileInput;
}>;

export type UpdateProfileMutation = {
  updateProfile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
};

export type UpdateUserMutationVariables = Exact<{
  user: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  updateUser: {
    id: string;
    role: UserRole;
    department: { id: string; name: string } | null;
    position: { id: string; name: string } | null;
  };
};

export type ChangePasswordMutationVariables = Exact<{
  args: ChangePasswordInput;
}>;

export type ChangePasswordMutation = { changePassword: { id: string } };

export const LoginDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Login" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "auth" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AuthInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "login" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "auth" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "auth" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_token" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "refresh_token" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SignupDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Signup" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "auth" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "SignupInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "signup" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "auth" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "auth" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_token" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "refresh_token" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const UpdateTokenDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateToken" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateToken" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_token" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "refresh_token" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateTokenMutation, UpdateTokenMutationVariables>;
export const MeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Me" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
                { kind: "Field", name: { kind: "Name", value: "first_name" } },
                { kind: "Field", name: { kind: "Name", value: "last_name" } },
                { kind: "Field", name: { kind: "Name", value: "avatar" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const ForgotPasswordDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ForgotPassword" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "auth" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ForgotPasswordInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "forgotPassword" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "auth" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "auth" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;
export const ResetPasswordDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ResetPassword" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "auth" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ResetPasswordInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "resetPassword" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "auth" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "auth" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>;
export const VerifyMailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "VerifyMail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "mail" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "VerifyMailInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "verifyMail" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "mail" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mail" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<VerifyMailMutation, VerifyMailMutationVariables>;
export const SendVerificationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SendVerification" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sendVerification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SendVerificationMutation,
  SendVerificationMutationVariables
>;
export const CvPreviewDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CvPreview" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cvId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "cv" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cvId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cvId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "created_at" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "education" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "position" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "department" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "profile" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "first_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "last_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "full_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "avatar" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "languages" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "proficiency",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "skills" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "categoryId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "mastery" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "languages" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proficiency" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "domain" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "environment" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "roles" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responsibilities" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CvPreviewQuery, CvPreviewQueryVariables>;
export const ExportPdfDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ExportPdf" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pdf" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ExportPdfInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "exportPdf" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pdf" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pdf" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExportPdfMutation, ExportPdfMutationVariables>;
export const CvProjectsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CvProjects" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cvId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "cv" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cvId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cvId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "domain" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "environment" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "roles" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responsibilities" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CvProjectsQuery, CvProjectsQueryVariables>;
export const AvailableProjectsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AvailableProjects" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "params" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "SearchPaginationInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "projects" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "params" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "params" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "domain" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "environment" },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "limit" } },
                { kind: "Field", name: { kind: "Name", value: "total_pages" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AvailableProjectsQuery,
  AvailableProjectsQueryVariables
>;
export const AddCvProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddCvProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "project" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AddCvProjectInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addCvProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "project" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "project" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "domain" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "environment" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "roles" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responsibilities" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddCvProjectMutation,
  AddCvProjectMutationVariables
>;
export const UpdateCvProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateCvProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "project" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateCvProjectInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateCvProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "project" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "project" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "domain" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "environment" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "roles" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responsibilities" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCvProjectMutation,
  UpdateCvProjectMutationVariables
>;
export const RemoveCvProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveCvProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "project" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "RemoveCvProjectInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeCvProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "project" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "project" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "domain" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "environment" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "roles" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responsibilities" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveCvProjectMutation,
  RemoveCvProjectMutationVariables
>;
export const CvSkillsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CvSkills" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cvId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "cv" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cvId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cvId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "profile" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "first_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "last_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "avatar" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "skills" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "categoryId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "mastery" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CvSkillsQuery, CvSkillsQueryVariables>;
export const AddCvSkillDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddCvSkill" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "skill" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AddCvSkillInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addCvSkill" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "skill" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skill" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddCvSkillMutation, AddCvSkillMutationVariables>;
export const UpdateCvSkillDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateCvSkill" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "skill" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateCvSkillInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateCvSkill" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "skill" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skill" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCvSkillMutation,
  UpdateCvSkillMutationVariables
>;
export const DeleteCvSkillDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteCvSkill" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "skill" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DeleteCvSkillInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteCvSkill" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "skill" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skill" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteCvSkillMutation,
  DeleteCvSkillMutationVariables
>;
export const CvsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Cvs" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "params" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "SearchPaginationInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "cvs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "params" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "params" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "created_at" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "education" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "user" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "email" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "limit" } },
                { kind: "Field", name: { kind: "Name", value: "total_pages" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CvsQuery, CvsQueryVariables>;
export const CvDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Cv" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cvId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "cv" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cvId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cvId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "created_at" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "education" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "profile" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "first_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "last_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "avatar" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CvQuery, CvQueryVariables>;
export const CreateCvDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateCv" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cv" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateCvInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createCv" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cv" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cv" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "created_at" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "education" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateCvMutation, CreateCvMutationVariables>;
export const UpdateCvDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateCv" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cv" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateCvInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateCv" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cv" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cv" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "education" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateCvMutation, UpdateCvMutationVariables>;
export const DeleteCvDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteCv" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cv" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DeleteCvInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteCv" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "cv" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "cv" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "affected" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteCvMutation, DeleteCvMutationVariables>;
export const ProfileLanguagesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ProfileLanguages" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "profile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "userId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "first_name" } },
                { kind: "Field", name: { kind: "Name", value: "last_name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "languages" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proficiency" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ProfileLanguagesQuery,
  ProfileLanguagesQueryVariables
>;
export const LanguagesCatalogDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LanguagesCatalog" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "params" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "SearchPaginationInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "languages" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "params" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "params" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "iso2" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "native_name" },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "total" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  LanguagesCatalogQuery,
  LanguagesCatalogQueryVariables
>;
export const AddProfileLanguageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddProfileLanguage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "language" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AddProfileLanguageInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addProfileLanguage" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "language" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "language" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "languages" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proficiency" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddProfileLanguageMutation,
  AddProfileLanguageMutationVariables
>;
export const UpdateProfileLanguageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProfileLanguage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "language" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateProfileLanguageInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateProfileLanguage" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "language" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "language" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "languages" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proficiency" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProfileLanguageMutation,
  UpdateProfileLanguageMutationVariables
>;
export const DeleteProfileLanguageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProfileLanguage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "language" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DeleteProfileLanguageInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteProfileLanguage" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "language" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "language" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "languages" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proficiency" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProfileLanguageMutation,
  DeleteProfileLanguageMutationVariables
>;
export const UploadAvatarDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UploadAvatar" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "avatar" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UploadAvatarInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "uploadAvatar" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "avatar" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "avatar" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UploadAvatarMutation,
  UploadAvatarMutationVariables
>;
export const DeleteAvatarDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteAvatar" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "avatar" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DeleteAvatarInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteAvatar" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "avatar" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "avatar" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteAvatarMutation,
  DeleteAvatarMutationVariables
>;
export const ProfileSkillsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ProfileSkills" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "profile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "userId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "first_name" } },
                { kind: "Field", name: { kind: "Name", value: "last_name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProfileSkillsQuery, ProfileSkillsQueryVariables>;
export const SkillCategoriesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SkillCategories" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "skillCategories" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "order" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parent" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SkillCategoriesQuery,
  SkillCategoriesQueryVariables
>;
export const SkillsCatalogDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SkillsCatalog" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "params" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "SearchPaginationInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "skills" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "params" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "params" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "total" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SkillsCatalogQuery, SkillsCatalogQueryVariables>;
export const AddProfileSkillDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddProfileSkill" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "skill" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AddProfileSkillInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addProfileSkill" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "skill" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skill" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddProfileSkillMutation,
  AddProfileSkillMutationVariables
>;
export const UpdateProfileSkillDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProfileSkill" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "skill" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateProfileSkillInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateProfileSkill" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "skill" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skill" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProfileSkillMutation,
  UpdateProfileSkillMutationVariables
>;
export const DeleteProfileSkillDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProfileSkill" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "skill" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DeleteProfileSkillInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteProfileSkill" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "skill" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skill" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "skills" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "categoryId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mastery" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProfileSkillMutation,
  DeleteProfileSkillMutationVariables
>;
export const UsersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Users" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "params" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "SearchPaginationInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "params" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "params" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "profile" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "first_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "last_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "avatar" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "department" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "position" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "limit" } },
                { kind: "Field", name: { kind: "Name", value: "total_pages" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const UserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "User" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "userId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
                { kind: "Field", name: { kind: "Name", value: "created_at" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "profile" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "first_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "last_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "full_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "avatar" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "department" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "position" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const DepartmentsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Departments" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "departments" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DepartmentsQuery, DepartmentsQueryVariables>;
export const PositionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Positions" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "positions" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PositionsQuery, PositionsQueryVariables>;
export const UpdateProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProfile" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "profile" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateProfileInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateProfile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "profile" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "profile" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "first_name" } },
                { kind: "Field", name: { kind: "Name", value: "last_name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
>;
export const UpdateUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateUser" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "user" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateUserInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateUser" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "user" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "user" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "department" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "position" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const ChangePasswordDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ChangePassword" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "args" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ChangePasswordInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "changePassword" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "args" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "args" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;
