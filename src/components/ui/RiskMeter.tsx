import type { RiskLevel } from "@/lib/domain/types";

interface RiskMeterProps {
  level: RiskLevel;
  showLabel?: boolean;
}

const riskConfig: Record<RiskLevel, { width: string; color: string; label: string }> = {
  low: { width: "w-1/4", color: "bg-risk-low", label: "Low" },
  medium: { width: "w-2/4", color: "bg-risk-medium", label: "Medium" },
  high: { width: "w-3/4", color: "bg-risk-high", label: "High" },
  critical: { width: "w-full", color: "bg-risk-critical", label: "Critical" },
};

export function RiskMeter({ level, showLabel = true }: RiskMeterProps) {
  const config = riskConfig[level];

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${config.width} ${config.color}`}
        />
      </div>
      {showLabel && (
        <span className="font-sans text-2xs text-structure-secondary uppercase tracking-wider min-w-[3rem]">
          {config.label}
        </span>
      )}
    </div>
  );
}
