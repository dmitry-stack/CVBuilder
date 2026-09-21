"use client";

import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client/react";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const client = useApolloClient();

  const handleLogout = async () => {
    await logoutAction();
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
