import type { SVGProps } from "react";

export function TrashXIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Top lid and handle */}
      <path d="M6 1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V2h3a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1h3v-.5zM7 2h2v-.25H7V2z" />
      {/* Body with X cutout */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 3.5h9v9.25a1.25 1.25 0 0 1-1.25 1.25h-6.5A1.25 1.25 0 0 1 3.5 12.75V3.5zm2.72 2.72a.75.75 0 0 1 1.06 0L8 6.94l.72-.72a.75.75 0 1 1 1.06 1.06L9.06 8l.72.72a.75.75 0 1 1-1.06 1.06L8 9.06l-.72.72a.75.75 0 0 1-1.06-1.06L6.94 8l-.72-.72a.75.75 0 0 1 0-1.06z"
      />
    </svg>
  );
}
