"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvatarUpload } from "../hooks/useAvatarUpload";

export interface ProfileAvatarProps {
  userId?: string;
  initialAvatar?: string | null;
  userName?: string;
  onAvatarChange?: (file: File | null) => void;
  editable?: boolean;
}

export function ProfileAvatar({
  userId,
  initialAvatar,
  userName = "User",
  onAvatarChange,
  editable = true,
}: ProfileAvatarProps) {
  const [customPreview, setCustomPreview] = useState<string | null | undefined>(
    undefined,
  );
  const [prevInitialAvatar, setPrevInitialAvatar] = useState(initialAvatar);

  if (initialAvatar !== prevInitialAvatar) {
    setPrevInitialAvatar(initialAvatar);
    setCustomPreview(undefined);
  }

  const preview =
    customPreview !== undefined ? customPreview : initialAvatar || null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadAvatar, deleteAvatar, isUploading, isDeleting } =
    useAvatarUpload({ userId });

  const initial = userName.charAt(0).toUpperCase() || "U";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editable) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    const previousPreview = customPreview;
    setCustomPreview(localUrl);

    try {
      if (userId) {
        const uploadedUrl = await uploadAvatar(file);
        if (uploadedUrl) {
          setCustomPreview(uploadedUrl);
        }
      }
      onAvatarChange?.(file);
    } catch {
      setCustomPreview(previousPreview);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editable) return;

    const previousPreview = customPreview;
    setCustomPreview(null);

    try {
      if (userId) {
        await deleteAvatar();
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onAvatarChange?.(null);
    } catch {
      setCustomPreview(previousPreview);
    }
  };

  const avatarContent = preview ? (
    <Image
      src={preview}
      alt={`${userName}'s avatar`}
      fill
      className="object-cover"
      unoptimized
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-white dark:text-[#2E2E2E]">
      <span className="font-roboto text-5xl font-light uppercase select-none">
        {initial}
      </span>
    </div>
  );

  if (!editable) {
    return (
      <div data-slot="profile-avatar" className="relative inline-block">
        <div
          className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-[#AEAEAE] dark:bg-[#626262] shadow-xs"
          aria-label={`${userName}'s avatar`}
        >
          {avatarContent}
        </div>
      </div>
    );
  }

  return (
    <div data-slot="profile-avatar" className="relative inline-block">
      <div className="flex flex-row items-center justify-center gap-8 sm:gap-10">
        <div className="relative group/avatar shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isDeleting}
            className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-[#AEAEAE] dark:bg-[#626262] shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-cv-accent focus:ring-offset-2 transition-transform hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Change profile photo"
          >
            {avatarContent}

            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={isUploading || isDeleting}
              title="Remove photo"
              aria-label="Remove photo"
              className={cn(
                "absolute top-0 right-1 h-6.5 w-6.5 rounded-full bg-[#C63031] text-white flex items-center justify-center shadow-xs cursor-pointer z-10 transition-all",
                "opacity-0 group-hover/avatar:opacity-100 hover:scale-110 hover:bg-[#B32627] focus:opacity-100 disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {isDeleting ? (
                <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
              ) : (
                <X className="h-3.5 w-3.5 stroke-[3]" />
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col items-start text-left">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isDeleting}
            className="group/upload-btn inline-flex items-center gap-2 cursor-pointer pb-0.5 border-b-2 border-transparent hover:border-current focus:border-current focus:outline-hidden text-zinc-900 dark:text-[#F5F5F7] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Upload avatar image"
          >
            <Upload
              className="h-6 w-6 shrink-0 stroke-[2.2]"
              aria-hidden="true"
            />
            <span className="text-[20px] font-medium font-roboto leading-6">
              {isUploading ? "Uploading..." : "Upload avatar image"}
            </span>
          </button>

          <p className="text-sm font-normal font-roboto text-[#8E8E93] dark:text-[#AEAEAE] mt-1.5">
            png, jpg or gif no more than 0.5MB
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/svg+xml"
        onChange={handleFileSelect}
        className="sr-only"
        aria-label="Upload profile photo"
      />
    </div>
  );
}
