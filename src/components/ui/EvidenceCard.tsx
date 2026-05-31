import type { Evidence } from "@/lib/domain/types";

interface EvidenceCardProps {
  evidence: Evidence;
  documentTitle?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function EvidenceCard({
  evidence,
  documentTitle,
  selected,
  onClick,
}: EvidenceCardProps) {
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
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider">
          {evidence.pageOrSection}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-2xs text-structure-muted">Confidence:</span>
          <span
            className={`font-sans text-2xs font-medium ${
              evidence.confidence === "high"
                ? "text-status-covered"
                : evidence.confidence === "medium"
                ? "text-status-partial"
                : "text-status-missing"
            }`}
          >
            {evidence.confidence}
          </span>
        </div>
      </div>
      {documentTitle && (
        <div className="font-sans text-xs text-structure-secondary mb-2">
          {documentTitle}
        </div>
      )}
      <blockquote className="text-xs text-structure leading-relaxed border-l-2 border-rule pl-3 mb-2">
        &ldquo;{evidence.excerpt}&rdquo;
      </blockquote>
      <div className="font-sans text-2xs text-structure-muted">
        {evidence.citation}
      </div>
    </button>
  );
}
