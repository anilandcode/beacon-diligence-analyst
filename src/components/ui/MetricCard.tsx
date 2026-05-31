interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({ label, value, subtitle, trend }: MetricCardProps) {
  return (
    <div className="p-4 border border-rule bg-surface-elevated">
      <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-medium text-structure">{value}</div>
        {trend && (
          <span
            className={`font-sans text-xs mb-1 ${
              trend === "up"
                ? "text-status-covered"
                : trend === "down"
                ? "text-status-missing"
                : "text-structure-muted"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="font-sans text-2xs text-structure-muted mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
}
