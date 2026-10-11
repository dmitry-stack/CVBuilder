import { cn } from "@/shared/lib/utils";

interface ProfileTabsSkeletonProps {
  activeTab?: "profile" | "skills" | "languages" | "cvs";
  showCvsTab?: boolean;
}

export function ProfileTabsSkeleton({
  activeTab = "profile",
  showCvsTab = false,
}: ProfileTabsSkeletonProps) {
  const tabs = [
    { id: "profile", label: "PROFILE" },
    { id: "skills", label: "SKILLS" },
    { id: "languages", label: "LANGUAGES" },
    ...(showCvsTab ? [{ id: "cvs", label: "CVS" }] : []),
  ];

  return (
    <nav className="flex h-12 border-b border-zinc-200 dark:border-zinc-800">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <div
            key={tab.id}
            className="flex h-12 w-auth-tab shrink-0 flex-col items-center justify-end"
          >
            <div
              className={cn(
                "flex h-auth-link w-full items-center justify-center text-center font-roboto text-sm leading-cv-label uppercase tracking-cv-wide transition-colors",
                isActive
                  ? "font-semibold text-cv-accent"
                  : "font-medium text-cv-text dark:text-zinc-400",
              )}
            >
              {tab.label}
            </div>
            <div
              className={cn(
                "h-auth-rule w-auth-tab transition-colors",
                isActive ? "bg-cv-accent" : "bg-transparent",
              )}
            />
          </div>
        );
      })}
    </nav>
  );
}
