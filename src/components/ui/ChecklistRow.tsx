import type { ChecklistItem } from "@/lib/domain/types";

interface ChecklistRowProps {
  item: ChecklistItem;
  findingCount: number;
  selected?: boolean;
  onClick?: () => void;
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  must_have: { label: "Must Have", color: "text-status-missing" },
  should_have: { label: "Should Have", color: "text-status-partial" },
  nice_to_have: { label: "Nice to Have", color: "text-structure-muted" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-structure-muted" },
  in_progress: { label: "In Progress", color: "bg-status-review" },
  completed: { label: "Completed", color: "bg-status-covered" },
  deferred: { label: "Deferred", color: "bg-status-partial" },
};

export function ChecklistRow({
  item,
  findingCount,
  selected,
  onClick,
}: ChecklistRowProps) {
  const priority = priorityConfig[item.priority];
  const status = statusConfig[item.status];

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
        <span className={`font-sans text-2xs font-medium uppercase tracking-wider ${priority.color}`}>
          {priority.label}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          <span className="font-sans text-2xs text-structure-muted">
            {status.label}
          </span>
        </div>
      </div>
      <p className="text-sm text-structure leading-snug mb-2">
        {item.question}
      </p>
      <div className="flex items-center gap-4 font-sans text-2xs text-structure-muted">
        <span>
          {findingCount} finding{findingCount !== 1 ? "s" : ""}
        </span>
        {item.assignedTo && <span>Assigned: {item.assignedTo}</span>}
        {item.dueDate && <span>Due: {item.dueDate}</span>}
      </div>
    </button>
  );
}
