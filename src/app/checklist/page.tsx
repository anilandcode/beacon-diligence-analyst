"use client";

import { useState } from "react";
import { checklist, getFollowUpCounts, getFinding } from "@/lib/data";
import type { ChecklistOwner, ChecklistItem } from "@/lib/domain/types";

const ownerOrder: ChecklistOwner[] = ["Legal", "Security", "CTO/Product"];

const priorityStyles: Record<string, { color: string; label: string; group: string }> = {
  must_have: { color: "text-status-missing", label: "Must Have", group: "Must resolve before approval" },
  should_have: { color: "text-status-partial", label: "Should Have", group: "Should resolve before procurement" },
  nice_to_have: { color: "text-structure-muted", label: "Nice to Have", group: "Future diligence" },
};

const ownerDescriptions: Record<ChecklistOwner, string> = {
  Legal: "Contractual and policy language reconciliation",
  Security: "Audit, insurance, and vendor documentation",
  "CTO/Product": "Technical plans and governance evidence",
};

export default function ChecklistPage() {
  const [ownerFilter, setOwnerFilter] = useState<ChecklistOwner | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const counts = getFollowUpCounts();

  let filtered = checklist;
  if (ownerFilter !== "all") {
    filtered = filtered.filter((c) => c.owner === ownerFilter);
  }
  if (priorityFilter !== "all") {
    filtered = filtered.filter((c) => c.priority === priorityFilter);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Follow-Up Checklist
        </div>
        <h1 className="text-xl md:text-2xl font-medium text-structure mb-2">
          Pre-Approval Questions
        </h1>
        <p className="text-sm text-structure-secondary">
          Items requiring clarification, evidence, or resolution before enterprise
          approval. Each item shows what triggered it.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="p-3 md:p-4 border border-rule bg-surface-elevated text-center">
          <div className="text-lg md:text-xl font-medium text-status-missing">{counts.mustHave}</div>
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider">Must Have</div>
        </div>
        <div className="p-3 md:p-4 border border-rule bg-surface-elevated text-center">
          <div className="text-lg md:text-xl font-medium text-status-partial">{counts.shouldHave}</div>
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider">Should Have</div>
        </div>
        <div className="p-3 md:p-4 border border-rule bg-surface-elevated text-center">
          <div className="text-lg md:text-xl font-medium text-structure-muted">{counts.niceToHave}</div>
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider">Nice to Have</div>
        </div>
      </div>

      {/* Owner summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {ownerOrder.map((owner) => {
          const items = checklist.filter((c) => c.owner === owner);
          const mustHaves = items.filter((c) => c.priority === "must_have").length;
          return (
            <div key={owner} className="p-3 border border-rule bg-surface-elevated">
              <div className="text-sm font-medium text-structure mb-1">{owner}</div>
              <div className="font-sans text-2xs text-structure-muted mb-2">
                {ownerDescriptions[owner]}
              </div>
              <div className="flex items-center gap-3 font-sans text-2xs">
                <span className="text-structure-muted">{items.length} items</span>
                {mustHaves > 0 && (
                  <span className="text-status-missing">{mustHaves} must-have</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 pb-4 border-b border-rule">
        <div className="flex items-center gap-2">
          <span className="font-sans text-2xs text-structure-muted">Owner:</span>
          <div className="flex flex-wrap gap-1">
            {(["all", ...ownerOrder] as const).map((owner) => (
              <button
                key={owner}
                type="button"
                onClick={() => setOwnerFilter(owner)}
                className={`px-2 py-1 font-sans text-2xs transition-colors ${
                  ownerFilter === owner
                    ? "bg-structure text-surface-elevated"
                    : "border border-rule text-structure-muted hover:text-structure"
                }`}
              >
                {owner === "all" ? "All" : owner}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-2xs text-structure-muted">Priority:</span>
          <div className="flex gap-1">
            {(["all", "must_have", "should_have", "nice_to_have"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-1 font-sans text-2xs transition-colors ${
                  priorityFilter === p
                    ? "bg-structure text-surface-elevated"
                    : "border border-rule text-structure-muted hover:text-structure"
                }`}
              >
                {p === "all" ? "All" : p.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped items */}
      {priorityFilter === "all" && ownerFilter === "all" ? (
        // Show grouped by readiness
        <div className="space-y-8">
          {(["must_have", "should_have", "nice_to_have"] as const).map((priority) => {
            const items = filtered.filter((c) => c.priority === priority);
            if (items.length === 0) return null;
            const group = priorityStyles[priority];
            return (
              <div key={priority}>
                <div className="flex items-center gap-3 mb-3 pb-2 border-b border-rule">
                  <h2 className="text-sm font-medium text-structure">{group.group}</h2>
                  <span className="font-sans text-2xs text-structure-muted bg-surface-sunken px-1.5 py-0.5">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <ChecklistDetailRow
                      key={item.id}
                      item={item}
                      expanded={expandedId === item.id}
                      onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Show flat filtered list
        <div className="space-y-2">
          {filtered.map((item) => (
            <ChecklistDetailRow
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center font-sans text-sm text-structure-muted">
              No items match the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChecklistDetailRow({
  item,
  expanded,
  onToggle,
}: {
  item: ChecklistItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const priority = priorityStyles[item.priority];

  return (
    <div className="border border-rule bg-surface-elevated">
      <button type="button" onClick={onToggle} className="w-full text-left p-4 md:p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className={`font-sans text-2xs font-medium uppercase tracking-wider ${priority.color}`}>
              {priority.label}
            </span>
            <span className="font-sans text-2xs text-structure-muted bg-surface-sunken px-1.5 py-0.5">
              {item.owner}
            </span>
          </div>
          <span className="font-sans text-2xs text-structure-muted capitalize">
            {item.status.replace(/_/g, " ")}
          </span>
        </div>

        <p className="text-sm text-structure leading-snug mb-2">{item.question}</p>

        <div className="font-sans text-2xs text-status-review">
          Triggered by: {item.triggeredBy}
        </div>
      </button>

      {expanded && (
        <div className="px-4 md:px-5 pb-5 pt-0 border-t border-rule">
          <div className="pt-4 space-y-3">
            <div>
              <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
                Reason
              </div>
              <div className="text-xs text-structure-secondary">{item.reason}</div>
            </div>

            {item.controlIds.length > 0 && (
              <div>
                <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
                  Related Controls
                </div>
                <div className="flex gap-2">
                  {item.controlIds.map((cid) => (
                    <span key={cid} className="font-sans text-2xs font-mono text-structure-muted bg-surface-sunken px-1.5 py-0.5">
                      {cid}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.findingIds.length > 0 && (
              <div>
                <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
                  Related Findings
                </div>
                <div className="space-y-1">
                  {item.findingIds.map((fid) => {
                    const finding = getFinding(fid);
                    return finding ? (
                      <div key={fid} className="flex items-center gap-2 text-xs">
                        <span
                          className={`inline-flex items-center rounded px-1 py-0.5 font-sans text-2xs font-medium uppercase tracking-wider text-white ${
                            finding.severity === "critical"
                              ? "bg-risk-critical"
                              : finding.severity === "high"
                              ? "bg-risk-high"
                              : "bg-risk-medium"
                          }`}
                        >
                          {finding.severity}
                        </span>
                        <span className="text-structure-secondary">{finding.title}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {item.triggeredBy.includes("Missing") && (
              <div className="px-3 py-2 bg-structure-muted/5 border border-structure-muted/20 font-sans text-2xs text-structure-muted">
                This item was triggered because no supporting evidence was found in the diligence room.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
