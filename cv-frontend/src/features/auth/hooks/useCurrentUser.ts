"use client";

import { useQuery } from "@apollo/client/react";
import { MeDocument } from "@/graphql/__generated__/graphql";

export function useCurrentUser() {
  const { data, loading, error } = useQuery(MeDocument, {
    errorPolicy: "ignore",
  });

  const currentUserId = data?.me?.id ? String(data.me.id) : undefined;

  const isOwnProfile = (targetUserId?: string | null) => {
    if (!currentUserId || !targetUserId) return false;
    return currentUserId === String(targetUserId);
  };

  return {
    currentUser: data?.me,
    currentUserId,
    isOwnProfile,
    loading,
    error,
  };
}
