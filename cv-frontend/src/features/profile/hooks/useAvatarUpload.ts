"use client";

import { useMutation, useApolloClient } from "@apollo/client/react";
import {
  UploadAvatarDocument,
  DeleteAvatarDocument,
  MeDocument,
  UserDocument,
  UsersDocument,
  type MeQuery,
  type UserQuery,
} from "@/graphql/__generated__/graphql";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { notify } from "@/shared/components/ui/toast";
import { validateAvatarFile, fileToBase64 } from "../lib/avatar.utils";

interface UseAvatarUploadOptions {
  userId?: string;
}

export function useAvatarUpload({ userId }: UseAvatarUploadOptions = {}) {
  const client = useApolloClient();
  const { currentUserId } = useCurrentUser();

  const [uploadAvatarMutation, { loading: isUploading }] =
    useMutation(UploadAvatarDocument);
  const [deleteAvatarMutation, { loading: isDeleting }] =
    useMutation(DeleteAvatarDocument);

  const isSelf = Boolean(
    userId && currentUserId && String(userId) === String(currentUserId),
  );

  const updateCacheWithAvatar = (newAvatar: string | null) => {
    try {
      if (isSelf) {
        const existingMe = client.readQuery<MeQuery>({ query: MeDocument });
        if (existingMe?.me) {
          client.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                ...existingMe.me,
                avatar: newAvatar,
              },
            },
          });
        }
      }

      if (userId) {
        const existingUser = client.readQuery<UserQuery>({
          query: UserDocument,
          variables: { userId },
        });
        if (existingUser?.user?.profile) {
          client.writeQuery<UserQuery>({
            query: UserDocument,
            variables: { userId },
            data: {
              user: {
                ...existingUser.user,
                profile: {
                  ...existingUser.user.profile,
                  avatar: newAvatar,
                },
              },
            },
          });
        }
      }
    } catch {
      // Ignore cache write errors if queries are not yet cached
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const validation = validateAvatarFile(file);
    if (!validation.isValid) {
      notify.error(validation.error || "Invalid file", "Upload Error");
      throw new Error(validation.error);
    }

    if (!userId) {
      return null;
    }

    const base64 = await fileToBase64(file);

    const refetchList: Array<{
      query: unknown;
      variables?: Record<string, unknown>;
    }> = [{ query: UsersDocument }];
    if (isSelf) {
      refetchList.push({ query: MeDocument });
    }
    if (userId) {
      refetchList.push({ query: UserDocument, variables: { userId } });
    }

    const response = await uploadAvatarMutation({
      variables: {
        avatar: {
          userId,
          base64,
          size: file.size,
          type: file.type,
        },
      },
      refetchQueries: refetchList as unknown as Parameters<
        typeof uploadAvatarMutation
      >[0]["refetchQueries"],
    });

    const newUrl = response.data?.uploadAvatar;
    if (newUrl) {
      updateCacheWithAvatar(newUrl);
      notify.success("Avatar uploaded successfully!");
      return newUrl;
    }

    return null;
  };

  const deleteAvatar = async (): Promise<boolean> => {
    if (!userId) {
      return false;
    }

    const refetchList: Array<{
      query: unknown;
      variables?: Record<string, unknown>;
    }> = [{ query: UsersDocument }];
    if (isSelf) {
      refetchList.push({ query: MeDocument });
    }
    if (userId) {
      refetchList.push({ query: UserDocument, variables: { userId } });
    }

    await deleteAvatarMutation({
      variables: {
        avatar: {
          userId,
        },
      },
      refetchQueries: refetchList as unknown as Parameters<
        typeof deleteAvatarMutation
      >[0]["refetchQueries"],
    });

    updateCacheWithAvatar(null);
    notify.success("Avatar removed successfully!");
    return true;
  };

  return {
    uploadAvatar,
    deleteAvatar,
    isUploading,
    isDeleting,
  };
}
