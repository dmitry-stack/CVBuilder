 
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type AuthInput = {
  email: string;
  password: string;
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
