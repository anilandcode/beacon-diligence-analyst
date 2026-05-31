import type { ControlStatus, DocumentStatus, FindingSeverity } from "@/lib/domain/types";

type BadgeVariant = "control" | "document" | "severity";

interface StatusBadgeProps {
  variant: BadgeVariant;
  status: ControlStatus | DocumentStatus | FindingSeverity;
  size?: "sm" | "md";
}

const controlColors: Record<string, string> = {
  covered: "bg-status-covered text-white",
  partial: "bg-status-partial text-white",
  missing: "bg-status-missing text-white",
  conflict: "bg-status-conflict text-white",
  not_applicable: "bg-structure-muted text-white",
};

const documentColors: Record<string, string> = {
  current: "bg-status-covered text-white",
  expired: "bg-status-missing text-white",
  missing: "bg-structure-muted text-white",
  draft: "bg-status-partial text-white",
};

const severityColors: Record<string, string> = {
  info: "bg-structure-muted text-white",
  low: "bg-risk-low text-white",
  medium: "bg-risk-medium text-white",
  high: "bg-risk-high text-white",
  critical: "bg-risk-critical text-white",
};

const colorMaps = {
  control: controlColors,
  document: documentColors,
  severity: severityColors,
};

export function StatusBadge({ variant, status, size = "sm" }: StatusBadgeProps) {
  const colors = colorMaps[variant];
  const colorClass = colors[status] ?? "bg-structure-muted text-white";
  const sizeClass = size === "sm" ? "text-2xs px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={`inline-flex items-center rounded font-sans font-medium uppercase tracking-wider ${colorClass} ${sizeClass}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
