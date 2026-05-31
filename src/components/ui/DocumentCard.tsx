import type { DiligenceDocument } from "@/lib/domain/types";
import { StatusBadge } from "./StatusBadge";

interface DocumentCardProps {
  document: DiligenceDocument;
  selected?: boolean;
  onClick?: () => void;
}

const categoryLabels: Record<string, string> = {
  policy: "Policy",
  contract: "Contract",
  security: "Security",
  hr: "HR",
  financial: "Financial",
  technical: "Technical",
};

export function DocumentCard({ document, selected, onClick }: DocumentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 border transition-colors ${
        selected
          ? "border-status-review bg-status-review/5"
          : "border-rule hover:border-rule-strong bg-surface-elevated"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="font-sans text-xs text-structure-muted uppercase tracking-wider">
          {categoryLabels[document.category]}
        </div>
        <StatusBadge variant="document" status={document.status} />
      </div>
      <h3 className="text-sm font-medium text-structure leading-snug mb-2">
        {document.title}
      </h3>
      <div className="font-sans text-2xs text-structure-muted">
        Updated {document.lastUpdated}
      </div>
    </button>
  );
}
