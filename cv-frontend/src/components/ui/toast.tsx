"use client";

import { X } from "lucide-react";
import {
  toast as reactToast,
  ToastContainer,
  type ToastOptions,
} from "react-toastify";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastContentProps {
  title: string;
  description: string;
}

export function ToastContent({ title, description }: ToastContentProps) {
  return (
    <div className="flex flex-col justify-center gap-1 font-roboto">
      <div className="font-medium text-base leading-6 tracking-cv">{title}</div>
      <div className="font-normal text-xs leading-5 tracking-cv opacity-90">
        {description}
      </div>
    </div>
  );
}

export function ToastCloseButton({
  closeToast,
}: {
  closeToast?: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={closeToast}
      aria-label="Close notification"
      className="inline-flex h-6 w-6 items-center justify-center rounded-sm hover:opacity-75 transition-opacity cursor-pointer"
    >
      <X className="h-3 w-3 shrink-0" aria-hidden="true" />
    </button>
  );
}

export function AppToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      closeButton={({ closeToast }) => (
        <ToastCloseButton closeToast={closeToast} />
      )}
    />
  );
}

export const notify = {
  success: (description: string, title = "Success", options?: ToastOptions) =>
    reactToast.success(
      <ToastContent title={title} description={description} />,
      options,
    ),
  error: (description: string, title = "Error", options?: ToastOptions) =>
    reactToast.error(
      <ToastContent title={title} description={description} />,
      options,
    ),
  warning: (description: string, title = "Warning", options?: ToastOptions) =>
    reactToast.warning(
      <ToastContent title={title} description={description} />,
      options,
    ),
  info: (description: string, title = "Info", options?: ToastOptions) =>
    reactToast.info(
      <ToastContent title={title} description={description} />,
      options,
    ),
};
