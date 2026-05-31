"use client";

import { useState } from "react";
import {
  controls,
  getControlSummary,
  getEvidenceForControl,
  getFindingsForControl,
  getChecklistForFinding,
  getDocument,
} from "@/lib/data";
import type { Control, ControlStatus } from "@/lib/domain/types";

const frameworks = ["SOC2", "ISO27001", "GDPR", "CUSTOM"] as const;

const statusStyles: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  covered: { bg: "bg-status-covered", text: "text-status-covered", label: "Covered" },
  partial: { bg: "bg-status-partial", text: "text-status-partial", label: "Partial" },
  missing: { bg: "bg-status-missing", text: "text-status-missing", label: "Missing" },
  conflict: { bg: "bg-status-conflict", text: "text-status-conflict", label: "Conflict" },
  not_applicable: { bg: "bg-structure-muted", text: "text-structure-muted", label: "N/A" },
};

export default function ControlsPage() {
  const [activeFramework, setActiveFramework] = useState<string>("SOC2");
  const [statusFilter, setStatusFilter] = useState<ControlStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const summary = getControlSummary();

  let filteredControls = controls.filter(
    (c) => c.framework === activeFramework
  );
  if (statusFilter !== "all") {
    filteredControls = filteredControls.filter(
      (c) => c.status === statusFilter
    );
  }
  const selected = selectedId
    ? controls.find((c) => c.id === selectedId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-2">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Control Map
        </div>
        <h1 className="text-2xl font-medium text-structure mb-2">
          Framework Controls
        </h1>
        <p className="text-sm text-structure-secondary mb-6">
          Mapping compliance framework requirements to evidence, status, and risk.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <SummaryCard
          label="Covered"
          count={summary.covered}
          color="text-status-covered"
        />
        <SummaryCard
          label="Partial"
          count={summary.partial}
          color="text-status-partial"
        />
        <SummaryCard
          label="Missing"
          count={summary.missing}
          color="text-status-missing"
        />
        <SummaryCard
          label="Conflict"
          count={summary.conflict}
          color="text-status-conflict"
        />
        <SummaryCard
          label="Total"
          count={summary.total}
          color="text-structure"
        />
      </div>

      {/* Framework tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-rule">
        {frameworks.map((fw) => {
          const fwControls = controls.filter((c) => c.framework === fw);
          const isActive = activeFramework === fw;
          return (
            <button
              key={fw}
              type="button"
              onClick={() => {
                setActiveFramework(fw);
                setSelectedId(null);
              }}
              className={`px-4 py-2.5 font-sans text-xs uppercase tracking-wider transition-colors ${
                isActive
                  ? "text-structure border-b-2 border-structure -mb-px"
                  : "text-structure-muted hover:text-structure-secondary"
              }`}
            >
              {fw}{" "}
              <span className="text-2xs text-structure-muted">
                ({fwControls.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="font-sans text-2xs text-structure-muted">Status:</span>
        {(["all", "covered", "partial", "missing", "conflict"] as const).map(
          (s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 font-sans text-2xs transition-colors ${
                statusFilter === s
                  ? "bg-structure text-surface-elevated"
                  : "border border-rule text-structure-muted hover:text-structure"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          )
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Controls list */}
        <div className="flex-1 space-y-2">
          {filteredControls.map((control) => (
            <ControlDetailRow
              key={control.id}
              control={control}
              selected={selectedId === control.id}
              onClick={() =>
                setSelectedId(selectedId === control.id ? null : control.id)
              }
            />
          ))}
          {filteredControls.length === 0 && (
            <div className="p-8 text-center font-sans text-sm text-structure-muted">
              No controls match the selected filters.
            </div>
          )}
        </div>

        {/* Inspector panel */}
        {selected && (
          <div className="w-96 flex-shrink-0">
            <ControlInspector
              control={selected}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="p-3 border border-rule bg-surface-elevated text-center">
      <div className={`text-lg font-medium ${color}`}>{count}</div>
      <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function ControlDetailRow({
  control,
  selected,
  onClick,
}: {
  control: Control;
  selected: boolean;
  onClick: () => void;
}) {
  const status = statusStyles[control.status];
  const evCount = control.evidenceIds.length;
  const ctrlFindings = getFindingsForControl(control.controlId);
  const followUps = ctrlFindings.flatMap((f) => getChecklistForFinding(f.id));
  const uniqueFollowUps = followUps.filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
  );

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
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-mono text-structure-muted">
            {control.controlId}
          </span>
          <span className={`w-2 h-2 rounded-full ${status.bg}`} />
          <span
            className={`font-sans text-2xs font-medium uppercase tracking-wider ${status.text}`}
          >
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans text-2xs text-structure-muted">
          <span>{evCount} evidence</span>
          {ctrlFindings.length > 0 && (
            <span className="text-status-missing">
              {ctrlFindings.length} finding
              {ctrlFindings.length !== 1 ? "s" : ""}
            </span>
          )}
          {uniqueFollowUps.length > 0 && (
            <span className="text-status-partial">
              {uniqueFollowUps.length} follow-up
              {uniqueFollowUps.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <h3 className="text-sm font-medium text-structure leading-snug mb-1">
        {control.title}
      </h3>
      <p className="text-xs text-structure-secondary leading-relaxed">
        {control.description}
      </p>

      {control.notes && (
        <div className="mt-2 text-xs text-structure-muted italic">
          {control.notes}
        </div>
      )}
    </button>
  );
}

function ControlInspector({
  control,
  onClose,
}: {
  control: Control;
  onClose: () => void;
}) {
  const status = statusStyles[control.status];
  const evItems = getEvidenceForControl(control.controlId);
  const ctrlFindings = getFindingsForControl(control.controlId);
  const followUps = ctrlFindings.flatMap((f) => getChecklistForFinding(f.id));
  const uniqueFollowUps = followUps.filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
  );

  return (
    <div className="border border-rule bg-surface-elevated p-5 sticky top-8">
      {/* Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${status.bg}`} />
          <span
            className={`font-sans text-xs font-medium uppercase tracking-wider ${status.text}`}
          >
            {status.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="font-sans text-2xs text-structure-muted hover:text-structure"
        >
          Close
        </button>
      </div>

      <div className="font-sans text-xs font-mono text-structure-muted mb-1">
        {control.framework} · {control.controlId}
      </div>
      <h2 className="text-base font-medium text-structure mb-2">
        {control.title}
      </h2>
      <p className="text-xs text-structure-secondary leading-relaxed mb-4">
        {control.description}
      </p>

      {/* Risk */}
      <div className="mb-4 pb-4 border-b border-rule">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Risk Level
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                control.riskLevel === "low"
                  ? "w-1/4 bg-risk-low"
                  : control.riskLevel === "medium"
                  ? "w-2/4 bg-risk-medium"
                  : control.riskLevel === "high"
                  ? "w-3/4 bg-risk-high"
                  : "w-full bg-risk-critical"
              }`}
            />
          </div>
          <span className="font-sans text-2xs text-structure-muted uppercase">
            {control.riskLevel}
          </span>
        </div>
      </div>

      {/* Evidence — show supporting, conflicting, missing */}
      <div className="mb-4">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Evidence ({evItems.length})
        </div>
        {evItems.length > 0 ? (
          <div className="space-y-2">
            {evItems.map((ev) => {
              const doc = getDocument(ev.documentId);
              // Determine relationship: supporting or conflicting
              const isConflicting =
                control.status === "conflict" && evItems.length > 1;
              return (
                <div
                  key={ev.id}
                  className={`p-2 border ${
                    isConflicting
                      ? "border-status-conflict/30 bg-status-conflict/5"
                      : "border-rule bg-surface-sunken"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans text-2xs text-structure-muted">
                      {doc?.title}
                    </span>
                    <span className="font-sans text-2xs font-mono text-status-review">
                      [{ev.id}]
                    </span>
                  </div>
                  <blockquote className="text-xs text-structure-secondary leading-relaxed border-l-2 border-rule pl-2">
                    &ldquo;{ev.excerpt}&rdquo;
                  </blockquote>
                  {isConflicting && (
                    <div className="mt-1 font-sans text-2xs text-status-conflict">
                      Contradicts other evidence
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2 bg-structure-muted/5 border border-structure-muted/20 font-sans text-2xs text-structure-muted">
            No evidence found — control classified as missing
          </div>
        )}
      </div>

      {/* Findings */}
      {ctrlFindings.length > 0 && (
        <div className="mb-4">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Findings ({ctrlFindings.length})
          </div>
          <div className="space-y-2">
            {ctrlFindings.map((f) => (
              <div
                key={f.id}
                className="p-2 bg-surface-sunken border border-rule"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center rounded px-1 py-0.5 font-sans text-2xs font-medium uppercase tracking-wider text-white ${
                      f.severity === "critical"
                        ? "bg-risk-critical"
                        : f.severity === "high"
                        ? "bg-risk-high"
                        : "bg-risk-medium"
                    }`}
                  >
                    {f.severity}
                  </span>
                  <span className="text-xs font-medium text-structure">
                    {f.title}
                  </span>
                </div>
                <div className="text-xs text-structure-secondary">
                  {f.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up questions */}
      {uniqueFollowUps.length > 0 && (
        <div className="mb-4">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Follow-Up Questions ({uniqueFollowUps.length})
          </div>
          <div className="space-y-2">
            {uniqueFollowUps.map((cl) => (
              <div
                key={cl.id}
                className="p-2 bg-surface-sunken border border-rule"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-sans text-2xs font-medium uppercase tracking-wider ${
                      cl.priority === "must_have"
                        ? "text-status-missing"
                        : cl.priority === "should_have"
                        ? "text-status-partial"
                        : "text-structure-muted"
                    }`}
                  >
                    {cl.priority.replace(/_/g, " ")}
                  </span>
                  <span className="font-sans text-2xs text-structure-muted">
                    {cl.owner}
                  </span>
                </div>
                <div className="text-xs text-structure-secondary">
                  {cl.question}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {control.notes && (
        <div className="pt-4 border-t border-rule">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
            Notes
          </div>
          <div className="text-xs text-structure-secondary italic">
            {control.notes}
          </div>
        </div>
      )}
    </div>
  );
}
