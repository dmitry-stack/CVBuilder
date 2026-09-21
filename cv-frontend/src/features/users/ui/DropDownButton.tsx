"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownMenuButtonProps {
  userId: string;
}

export function DropdownMenuButton({ userId }: DropdownMenuButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-hidden"
            title="User actions"
            aria-label={`Actions for user ${userId}`}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href={`/users/${userId}`} />}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem>Update</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
