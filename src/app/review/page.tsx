"use client";

import { useState } from "react";
import {
  findings,
  getControlSummary,
  getRiskSummary,
  getFollowUpCounts,
  getEvidenceByIds,
  getDocument,
} from "@/lib/data";
import type { Finding } from "@/lib/domain/types";

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

export default function ReviewPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ctrlSummary = getControlSummary();
  const riskSummary = getRiskSummary();
  const followUps = getFollowUpCounts();
  const sortedFindings = [...findings].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-2">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Review Workspace
        </div>
        <h1 className="text-2xl font-medium text-structure mb-3">
          Diligence Review — NovaPay AI
        </h1>
      </div>

      {/* Flagship question */}
      <div className="mb-8 border border-rule bg-surface-elevated p-6">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Primary Review Question
        </div>
        <blockquote className="text-base text-structure italic leading-relaxed">
          &ldquo;Is NovaPay AI ready for enterprise diligence, what evidence
          supports that, what gaps remain, and what should we ask before
          approval?&rdquo;
        </blockquote>
      </div>

      {/* Overall posture */}
      <div className="mb-8 border border-status-missing/30 bg-status-missing/5 p-6">
        <div className="font-sans text-xs text-status-missing font-medium uppercase tracking-wider mb-2">
          Overall Posture: Not Ready for Enterprise Approval
        </div>
        <p className="text-sm text-structure-secondary leading-relaxed">
          NovaPay AI submitted 18 documents for review. Of 16 assessed controls,
          6 are covered, 4 partially covered, 3 missing, and 3 contain
          conflicting evidence. Three critical-severity findings — including a
          direct conflict between the AI Data-Use Policy and the MSA — must be
          resolved before enterprise approval.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricBox
          label="Controls Covered"
          value={`${ctrlSummary.covered}/${ctrlSummary.total}`}
          subtitle="Fully evidenced"
        />
        <MetricBox
          label="Material Gaps"
          value={ctrlSummary.missing}
          subtitle="No evidence found"
          color="text-status-missing"
        />
        <MetricBox
          label="Conflicts"
          value={ctrlSummary.conflict}
          subtitle="Contradictory evidence"
          color="text-status-conflict"
        />
        <MetricBox
          label="Follow-Up Items"
          value={followUps.mustHave + followUps.shouldHave}
          subtitle={`${followUps.mustHave} must-have`}
          color="text-status-partial"
        />
      </div>

      {/* Control status + Risk distribution side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-rule bg-surface-elevated p-5">
          <h2 className="text-sm font-medium text-structure mb-4 pb-2 border-b border-rule">
            Control Status Breakdown
          </h2>
          <div className="space-y-3">
            <StatusBar label="Covered" count={ctrlSummary.covered} total={ctrlSummary.total} color="bg-status-covered" />
            <StatusBar label="Partial" count={ctrlSummary.partial} total={ctrlSummary.total} color="bg-status-partial" />
            <StatusBar label="Missing" count={ctrlSummary.missing} total={ctrlSummary.total} color="bg-status-missing" />
            <StatusBar label="Conflict" count={ctrlSummary.conflict} total={ctrlSummary.total} color="bg-status-conflict" />
          </div>
        </div>

        <div className="border border-rule bg-surface-elevated p-5">
          <h2 className="text-sm font-medium text-structure mb-4 pb-2 border-b border-rule">
            Risk Distribution
          </h2>
          <div className="space-y-3">
            <RiskBar label="Critical" count={riskSummary.critical} max={6} color="bg-risk-critical" />
            <RiskBar label="High" count={riskSummary.high} max={6} color="bg-risk-high" />
            <RiskBar label="Medium" count={riskSummary.medium} max={6} color="bg-risk-medium" />
            <RiskBar label="Low" count={riskSummary.low} max={6} color="bg-risk-low" />
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="border border-rule bg-surface-elevated">
        <div className="p-5 border-b border-rule">
          <h2 className="text-sm font-medium text-structure">
            Findings ({findings.length})
          </h2>
        </div>
        <div className="divide-y divide-rule">
          {sortedFindings.map((finding) => (
            <FindingRow
              key={finding.id}
              finding={finding}
              expanded={expandedId === finding.id}
              onToggle={() =>
                setExpandedId(expandedId === finding.id ? null : finding.id)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
  subtitle,
  color,
}: {
  label: string;
  value: string | number;
  subtitle: string;
  color?: string;
}) {
  return (
    <div className="p-4 border border-rule bg-surface-elevated">
      <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className={`text-2xl font-medium ${color ?? "text-structure"}`}>
        {value}
      </div>
      <div className="font-sans text-2xs text-structure-muted mt-1">
        {subtitle}
      </div>
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="font-sans text-xs text-structure-secondary w-20">
        {label}
      </div>
      <div className="flex-1 h-2 bg-surface-sunken rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="font-sans text-xs text-structure-muted w-8 text-right">
        {count}
      </div>
    </div>
  );
}

function RiskBar({
  label,
  count,
  max,
  color,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="font-sans text-xs text-structure-secondary w-20">
        {label}
      </div>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`h-4 flex-1 ${i < count ? color : "bg-surface-sunken"}`}
          />
        ))}
      </div>
      <div className="font-sans text-xs text-structure-muted w-8 text-right">
        {count}
      </div>
    </div>
  );
}

function FindingRow({
  finding,
  expanded,
  onToggle,
}: {
  finding: Finding;
  expanded: boolean;
  onToggle: () => void;
}) {
  const evidenceItems = getEvidenceByIds(finding.evidenceIds);

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 hover:bg-surface-sunken/30 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <span
              className={`inline-flex items-center rounded px-1.5 py-0.5 font-sans text-2xs font-medium uppercase tracking-wider text-white ${
                finding.severity === "critical"
                  ? "bg-risk-critical"
                  : finding.severity === "high"
                  ? "bg-risk-high"
                  : finding.severity === "medium"
                  ? "bg-risk-medium"
                  : "bg-risk-low"
              }`}
            >
              {finding.severity}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium text-structure">
                {finding.title}
              </div>
              <span
                className={`flex-shrink-0 inline-flex items-center rounded px-1.5 py-0.5 font-sans text-2xs font-medium uppercase tracking-wider ${
                  finding.category === "gap"
                    ? "bg-status-missing/10 text-status-missing"
                    : finding.category === "conflict"
                    ? "bg-status-conflict/10 text-status-conflict"
                    : finding.category === "risk"
                    ? "bg-status-partial/10 text-status-partial"
                    : "bg-surface-sunken text-structure-muted"
                }`}
              >
                {finding.category}
              </span>
            </div>
            <p className="text-xs text-structure-secondary mt-1">
              {finding.description}
            </p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-0 ml-12">
          <div className="border-t border-rule pt-4 space-y-4">
            {/* Evidence */}
            {evidenceItems.length > 0 ? (
              <div>
                <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
                  Supporting Evidence
                </div>
                <div className="space-y-2">
                  {evidenceItems.map((ev) => {
                    const doc = getDocument(ev.documentId);
                    return (
                      <div
                        key={ev.id}
                        className="p-3 bg-surface-sunken border border-rule"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-sans text-2xs text-structure-muted">
                            {doc?.title} — {ev.pageOrSection}
                          </span>
                          <span className="font-sans text-2xs font-mono text-status-review">
                            [{ev.id}]
                          </span>
                        </div>
                        <blockquote className="text-xs text-structure-secondary leading-relaxed border-l-2 border-rule pl-3">
                          &ldquo;{ev.excerpt}&rdquo;
                        </blockquote>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 bg-structure-muted/5 border border-structure-muted/20 font-sans text-2xs text-structure-muted">
                No evidence found — marked as missing/unsupported
              </div>
            )}

            {/* Recommendation */}
            <div>
              <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
                Recommendation
              </div>
              <div className="text-xs text-structure-secondary">
                {finding.recommendation}
              </div>
            </div>

            {/* Linked controls */}
            {finding.controlIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-sans text-2xs text-structure-muted">
                  Controls:
                </span>
                {finding.controlIds.map((cid) => (
                  <span
                    key={cid}
                    className="font-sans text-2xs font-mono text-structure-muted bg-surface-sunken px-1.5 py-0.5"
                  >
                    {cid}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
