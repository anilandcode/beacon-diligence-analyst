import type { Control } from "@/lib/domain/types";
import { StatusBadge } from "./StatusBadge";
import { RiskMeter } from "./RiskMeter";

interface ControlRowProps {
  control: Control;
  evidenceCount: number;
  selected?: boolean;
  onClick?: () => void;
}

export function ControlRow({
  control,
  evidenceCount,
  selected,
  onClick,
}: ControlRowProps) {
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
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="font-sans text-xs font-mono text-structure-muted">
          {control.framework} · {control.controlId}
        </div>
        <StatusBadge variant="control" status={control.status} />
      </div>
      <h3 className="text-sm font-medium text-structure leading-snug mb-2">
        {control.title}
      </h3>
      <p className="text-xs text-structure-secondary leading-relaxed mb-3">
        {control.description}
      </p>
      <div className="flex items-center justify-between gap-4">
        <RiskMeter level={control.riskLevel} />
        <div className="font-sans text-2xs text-structure-muted">
          {evidenceCount} evidence item{evidenceCount !== 1 ? "s" : ""}
        </div>
      </div>
    </button>
  );
}
