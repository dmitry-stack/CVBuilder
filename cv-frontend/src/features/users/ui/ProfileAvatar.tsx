"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";

interface ProfileAvatarProps {
  initialAvatar?: string | null;
  userName?: string;
  onAvatarChange?: (file: File | null) => void;
  editable?: boolean;
}

export function ProfileAvatar({
  initialAvatar,
  userName = "User",
  onAvatarChange,
  editable = true,
}: ProfileAvatarProps) {
  const [preview, setPreview] = useState<string | null>(initialAvatar || null);
  const [, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initial = userName.charAt(0).toUpperCase() || "U";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editable) return;
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onAvatarChange?.(file);
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editable) return;
    startTransition(() => {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onAvatarChange?.(null);
    });
  };

  if (!editable) {
    return (
      <div data-slot="profile-avatar" className="relative inline-block">
        <div
          className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-[#9E9E9E] dark:bg-zinc-600 shadow-xs"
          aria-label={`${userName}'s avatar`}
        >
          {preview ? (
            <Image
              src={preview}
              alt={`${userName}'s avatar`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white">
              <span className="font-roboto text-5xl font-light uppercase select-none">
                {initial}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div data-slot="profile-avatar" className="relative group inline-block">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-[#9E9E9E] dark:bg-zinc-600 shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-cv-accent focus:ring-offset-2 transition-transform hover:opacity-95"
        aria-label="Change profile photo"
      >
        {preview ? (
          <Image
            src={preview}
            alt={`${userName}'s avatar`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white">
            <span className="font-roboto text-5xl font-light uppercase select-none">
              {initial}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs transition-opacity duration-200">
          <Camera className="h-6 w-6 mb-1" />
          <span className="font-roboto">Change</span>
        </div>
      </button>

      {preview && (
        <button
          type="button"
          onClick={handleRemovePhoto}
          title="Remove photo"
          aria-label="Remove photo"
          className="absolute top-0 right-0 h-7 w-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="sr-only"
        aria-label="Upload profile photo"
      />
    </div>
  );
}
