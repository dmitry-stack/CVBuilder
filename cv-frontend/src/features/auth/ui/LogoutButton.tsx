"use client";

import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client/react";
import { authStorage } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const client = useApolloClient();

  const handleLogout = async () => {
    authStorage.clearTokens();

    await client.clearStore();

    router.push("/signin");
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Log out
    </Button>
  );
}
