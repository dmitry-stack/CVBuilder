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

export interface DropdownMenuButtonProps {
  id?: string;
  userId?: string;
  viewHref?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function DropdownMenuButton({
  id,
  userId,
  viewHref,
  onUpdate,
  onDelete,
}: DropdownMenuButtonProps) {
  const targetId = id || userId || "";
  const targetHref =
    viewHref || (userId ? `/users/${userId}` : `/users/${targetId}`);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-hidden cursor-pointer"
            title="User actions"
            aria-label={`Actions for user ${targetId}`}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href={targetHref} />}>
            View
          </DropdownMenuItem>
          {onUpdate ? (
            <DropdownMenuItem onClick={onUpdate}>Update</DropdownMenuItem>
          ) : (
            <DropdownMenuItem>Update</DropdownMenuItem>
          )}
          {onDelete ? (
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              Delete
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
