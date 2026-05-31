"use client";

import { useState } from "react";
import {
  evidence,
  getDocument,
  getControlByCode,
  getFindingsForControl,
  getChecklistForFinding,
} from "@/lib/data";
import type { Evidence } from "@/lib/domain/types";

type RelationshipType = "all" | "supports" | "conflicts" | "partial";

export default function EvidencePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [relFilter, setRelFilter] = useState<RelationshipType>("all");
  const [activeGraph, setActiveGraph] = useState<string>("ai-conflict");
  const selected = selectedId
    ? evidence.find((e) => e.id === selectedId)
    : null;

  // Filter by relationship type
  const filtered = evidence.filter((ev) => {
    if (relFilter === "all") return true;
    const linkedControls = ev.controlIds
      .map((cid) => getControlByCode(cid))
      .filter(Boolean);
    if (relFilter === "supports")
      return linkedControls.some((c) => c?.status === "covered");
    if (relFilter === "conflicts")
      return linkedControls.some((c) => c?.status === "conflict");
    if (relFilter === "partial")
      return linkedControls.some((c) => c?.status === "partial");
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Evidence & Citations
        </div>
        <h1 className="text-2xl font-medium text-structure mb-2">
          Evidence Graph
        </h1>
        <p className="text-sm text-structure-secondary">
          Document excerpts linked to controls, findings, and follow-up questions.
          Each evidence item shows its relationship to the control status.
        </p>
      </div>

      {/* Evidence graph selector */}
      <div className="mb-6">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
          Graph Scenarios
        </div>
        <div className="flex flex-wrap gap-2">
          {graphScenarios.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGraph(g.id)}
              className={`px-3 py-1.5 font-sans text-2xs transition-colors ${
                activeGraph === g.id
                  ? "bg-structure text-surface-elevated"
                  : "border border-rule text-structure-muted hover:text-structure"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active graph */}
      <div className="mb-10 border border-rule bg-surface-elevated p-6">
        <EvidenceGraph scenario={activeGraph} />
      </div>

      {/* Relationship filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="font-sans text-2xs text-structure-muted">
          Relationship:
        </span>
        {(["all", "supports", "conflicts", "partial"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRelFilter(r)}
            className={`px-2 py-1 font-sans text-2xs transition-colors ${
              relFilter === r
                ? "bg-structure text-surface-elevated"
                : "border border-rule text-structure-muted hover:text-structure"
            }`}
          >
            {r === "all" ? "All" : r}
          </button>
        ))}
        <span className="font-sans text-2xs text-structure-muted ml-2">
          ({filtered.length} items)
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Evidence list */}
        <div className="flex-1 space-y-3">
          {filtered.map((ev) => (
            <EvidenceRow
              key={ev.id}
              evidence={ev}
              selected={selectedId === ev.id}
              onClick={() =>
                setSelectedId(selectedId === ev.id ? null : ev.id)
              }
            />
          ))}
        </div>

        {/* Inspector */}
        {selected && (
          <div className="w-96 flex-shrink-0">
            <EvidenceInspector
              evidence={selected}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Graph scenarios
// ============================================================================

const graphScenarios = [
  { id: "ai-conflict", label: "AI Data-Use Conflict" },
  { id: "incident-response", label: "Incident Response (Partial)" },
  { id: "access-control", label: "Access Control (Partial)" },
  { id: "data-retention", label: "Data Retention (Conflict)" },
  { id: "encryption", label: "Encryption (Covered)" },
];

function EvidenceGraph({ scenario }: { scenario: string }) {
  const graphData: Record<
    string,
    {
      documents: { id: string; label: string }[];
      evidence: { id: string; label: string; excerpt: string; relationship: string }[];
      control: { id: string; label: string; status: string };
      finding: { id: string; label: string; severity: string } | null;
      followUp: { id: string; label: string; owner: string } | null;
    }
  > = {
    "ai-conflict": {
      documents: [
        { id: "doc-016", label: "AI Data-Use Policy" },
        { id: "doc-008", label: "Master Services Agreement" },
      ],
      evidence: [
        {
          id: "ev-011",
          label: "ev-011",
          excerpt: "Customer content is not used to train shared models.",
          relationship: "supports",
        },
        {
          id: "ev-012",
          label: "ev-012",
          excerpt: "Service data may be used to improve platform performance.",
          relationship: "contradicts",
        },
      ],
      control: { id: "DP1.1", label: "AI Data Use", status: "conflict" },
      finding: {
        id: "finding-003",
        label: "Conflicting AI Data-Use Language",
        severity: "critical",
      },
      followUp: {
        id: "cl-003",
        label: "Reconcile AI/MSA language",
        owner: "Legal",
      },
    },
    "incident-response": {
      documents: [
        { id: "doc-007", label: "Incident Response Plan" },
      ],
      evidence: [
        {
          id: "ev-005",
          label: "ev-005",
          excerpt: "All security events shall be triaged within 4 hours.",
          relationship: "partial",
        },
      ],
      control: { id: "CC7.2", label: "Incident Detection", status: "partial" },
      finding: null,
      followUp: null,
    },
    "access-control": {
      documents: [
        { id: "doc-001", label: "Information Security Policy" },
      ],
      evidence: [
        {
          id: "ev-001",
          label: "ev-001",
          excerpt: "Access rights shall be reviewed quarterly.",
          relationship: "partial",
        },
      ],
      control: { id: "CC6.3", label: "Role-Based Access", status: "partial" },
      finding: {
        id: "finding-009",
        label: "Quarterly Access Review Evidence Missing",
        severity: "low",
      },
      followUp: {
        id: "cl-009",
        label: "Provide access review documentation",
        owner: "Security",
      },
    },
    "data-retention": {
      documents: [
        { id: "doc-002", label: "Data Processing Agreement" },
        { id: "doc-004", label: "Privacy Policy" },
      ],
      evidence: [
        {
          id: "ev-003",
          label: "ev-003",
          excerpt: "Personal data shall be retained for 36 months.",
          relationship: "conflicts",
        },
        {
          id: "ev-004",
          label: "ev-004",
          excerpt: "We retain your personal data for 24 months.",
          relationship: "conflicts",
        },
      ],
      control: { id: "C1.1", label: "Data Classification", status: "conflict" },
      finding: {
        id: "finding-004",
        label: "Conflicting Data Retention Periods",
        severity: "high",
      },
      followUp: {
        id: "cl-004",
        label: "Clarify retention discrepancy",
        owner: "Legal",
      },
    },
    encryption: {
      documents: [
        { id: "doc-009", label: "API Security Documentation" },
        { id: "doc-011", label: "Penetration Test Results" },
      ],
      evidence: [
        {
          id: "ev-006",
          label: "ev-006",
          excerpt: "No critical vulnerabilities identified.",
          relationship: "supports",
        },
        {
          id: "ev-007",
          label: "ev-007",
          excerpt: "All API endpoints require OAuth 2.0 authentication.",
          relationship: "supports",
        },
      ],
      control: { id: "CC7.1", label: "Vulnerability Mgmt", status: "covered" },
      finding: null,
      followUp: null,
    },
  };

  const data = graphData[scenario] ?? graphData["ai-conflict"];

  return (
    <div>
      <div className="font-sans text-xs text-structure-muted uppercase tracking-wider mb-4">
        Document → Evidence → Control → Finding → Follow-Up
      </div>

      <div className="flex items-start gap-2 md:gap-3 overflow-x-auto pb-4">
        {/* Documents */}
        <div className="flex flex-col gap-2 min-w-[140px]">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
            Documents
          </div>
          {data.documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-structure bg-surface-elevated p-2"
            >
              <div className="font-sans text-xs font-medium text-structure">
                {doc.label}
              </div>
              <div className="font-sans text-2xs font-mono text-structure-muted">
                {doc.id}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 justify-center self-stretch">
          {data.documents.map((_, i) => (
            <div key={i} className="font-sans text-2xs text-structure-muted">
              →
            </div>
          ))}
        </div>

        {/* Evidence */}
        <div className="flex flex-col gap-2 min-w-[220px]">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
            Evidence
          </div>
          {data.evidence.map((ev) => (
            <div
              key={ev.id}
              className={`border p-2 ${
                ev.relationship === "contradicts" || ev.relationship === "conflicts"
                  ? "border-status-conflict bg-status-conflict/5"
                  : ev.relationship === "partial"
                  ? "border-status-partial bg-status-partial/5"
                  : "border-status-review bg-status-review/5"
              }`}
            >
              <div className="font-sans text-xs font-mono text-structure-muted">
                {ev.id}
              </div>
              <div className="text-xs text-structure-secondary mt-1">
                &ldquo;{ev.excerpt}&rdquo;
              </div>
              <div
                className={`font-sans text-2xs mt-1 ${
                  ev.relationship === "contradicts" || ev.relationship === "conflicts"
                    ? "text-status-conflict"
                    : ev.relationship === "partial"
                    ? "text-status-partial"
                    : "text-status-covered"
                }`}
              >
                {ev.relationship}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center self-center">
          <div className="font-sans text-2xs text-structure-muted">→</div>
        </div>

        {/* Control */}
        <div className="flex items-center min-w-[130px]">
          <div
            className={`border p-2 ${
              data.control.status === "conflict"
                ? "border-status-conflict bg-status-conflict/5"
                : data.control.status === "partial"
                ? "border-status-partial bg-status-partial/5"
                : "border-status-covered bg-status-covered/5"
            }`}
          >
            <div className="font-sans text-xs font-medium text-structure">
              {data.control.label}
            </div>
            <div className="font-sans text-2xs font-mono text-structure-muted">
              {data.control.id}
            </div>
            <div
              className={`font-sans text-2xs mt-1 uppercase ${
                data.control.status === "conflict"
                  ? "text-status-conflict"
                  : data.control.status === "partial"
                  ? "text-status-partial"
                  : "text-status-covered"
              }`}
            >
              {data.control.status}
            </div>
          </div>
        </div>

        <div className="flex items-center self-center">
          <div className="font-sans text-2xs text-structure-muted">→</div>
        </div>

        {/* Finding */}
        <div className="flex items-center min-w-[160px]">
          {data.finding ? (
            <div className="border border-risk-critical bg-risk-critical/5 p-2">
              <div className="font-sans text-xs font-medium text-structure">
                {data.finding.label}
              </div>
              <div
                className={`font-sans text-2xs mt-1 uppercase ${
                  data.finding.severity === "critical"
                    ? "text-risk-critical"
                    : data.finding.severity === "high"
                    ? "text-risk-high"
                    : "text-risk-medium"
                }`}
              >
                {data.finding.severity}
              </div>
            </div>
          ) : (
            <div className="border border-status-covered bg-status-covered/5 p-2">
              <div className="font-sans text-xs text-status-covered">
                No finding
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center self-center">
          <div className="font-sans text-2xs text-structure-muted">→</div>
        </div>

        {/* Follow-up */}
        <div className="flex items-center min-w-[180px]">
          {data.followUp ? (
            <div className="border border-status-partial bg-status-partial/5 p-2">
              <div className="font-sans text-xs font-medium text-structure">
                {data.followUp.label}
              </div>
              <div className="font-sans text-2xs text-structure-muted mt-1">
                {data.followUp.owner}
              </div>
            </div>
          ) : (
            <div className="border border-status-covered bg-status-covered/5 p-2">
              <div className="font-sans text-xs text-status-covered">
                No follow-up
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Evidence row and inspector
// ============================================================================

function EvidenceRow({
  evidence: ev,
  selected,
  onClick,
}: {
  evidence: Evidence;
  selected: boolean;
  onClick: () => void;
}) {
  const doc = getDocument(ev.documentId);
  const linkedControls = ev.controlIds
    .map((cid) => getControlByCode(cid))
    .filter(Boolean);
  const hasConflict = linkedControls.some((c) => c?.status === "conflict");
  const hasPartial = linkedControls.some((c) => c?.status === "partial");

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
        <div>
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
            {ev.pageOrSection}
          </div>
          <div className="font-sans text-xs text-structure-secondary">
            {doc?.title ?? "Unknown Document"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasConflict && (
            <span className="font-sans text-2xs text-status-conflict bg-status-conflict/10 px-1.5 py-0.5">
              conflict
            </span>
          )}
          {hasPartial && !hasConflict && (
            <span className="font-sans text-2xs text-status-partial bg-status-partial/10 px-1.5 py-0.5">
              partial
            </span>
          )}
          <span className="font-sans text-2xs font-mono text-status-review bg-status-review/10 px-1.5 py-0.5">
            [{ev.id}]
          </span>
        </div>
      </div>

      <blockquote className="text-sm text-structure leading-relaxed border-l-2 border-rule pl-4 mb-3">
        &ldquo;{ev.excerpt}&rdquo;
      </blockquote>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {ev.controlIds.map((cid) => {
            const ctrl = getControlByCode(cid);
            return (
              <span
                key={cid}
                className={`font-sans text-2xs font-mono px-1.5 py-0.5 ${
                  ctrl?.status === "covered"
                    ? "bg-status-covered/10 text-status-covered"
                    : ctrl?.status === "partial"
                    ? "bg-status-partial/10 text-status-partial"
                    : ctrl?.status === "conflict"
                    ? "bg-status-conflict/10 text-status-conflict"
                    : "bg-surface-sunken text-structure-muted"
                }`}
              >
                {cid}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-sans text-2xs text-structure-muted">
            Confidence:
          </span>
          <span
            className={`font-sans text-2xs font-medium ${
              ev.confidence === "high"
                ? "text-status-covered"
                : ev.confidence === "medium"
                ? "text-status-partial"
                : "text-status-missing"
            }`}
          >
            {ev.confidence}
          </span>
        </div>
      </div>
    </button>
  );
}

function EvidenceInspector({
  evidence: ev,
  onClose,
}: {
  evidence: Evidence;
  onClose: () => void;
}) {
  const doc = getDocument(ev.documentId);
  const linkedControls = ev.controlIds
    .map((cid) => getControlByCode(cid))
    .filter(Boolean);

  const linkedFindings = ev.controlIds.flatMap((cid) =>
    getFindingsForControl(cid)
  );
  const uniqueFindings = linkedFindings.filter(
    (f, i, arr) => arr.findIndex((x) => x.id === f.id) === i
  );

  const linkedChecklist = uniqueFindings.flatMap((f) =>
    getChecklistForFinding(f.id)
  );
  const uniqueChecklist = linkedChecklist.filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
  );

  return (
    <div className="border border-rule bg-surface-elevated p-5 sticky top-8">
      <div className="flex items-start justify-between mb-4">
        <span className="font-sans text-2xs font-mono text-status-review">
          [{ev.id}]
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-sans text-2xs text-structure-muted hover:text-structure"
        >
          Close
        </button>
      </div>

      <h2 className="text-base font-medium text-structure mb-1">
        {doc?.title ?? "Unknown Document"}
      </h2>
      <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-4">
        {ev.pageOrSection}
      </div>

      <blockquote className="text-sm text-structure leading-relaxed border-l-2 border-rule pl-4 mb-4">
        &ldquo;{ev.excerpt}&rdquo;
      </blockquote>

      <div className="space-y-2 mb-4 pb-4 border-b border-rule text-xs">
        <div className="flex justify-between">
          <span className="text-structure-muted">Citation</span>
          <span className="text-structure-secondary">{ev.citation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-structure-muted">Confidence</span>
          <span
            className={
              ev.confidence === "high"
                ? "text-status-covered"
                : ev.confidence === "medium"
                ? "text-status-partial"
                : "text-status-missing"
            }
          >
            {ev.confidence}
          </span>
        </div>
      </div>

      {/* Linked controls */}
      {linkedControls.length > 0 && (
        <div className="mb-4">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Control Domain
          </div>
          <div className="space-y-1">
            {linkedControls.map(
              (ctrl) =>
                ctrl && (
                  <div
                    key={ctrl.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        ctrl.status === "covered"
                          ? "bg-status-covered"
                          : ctrl.status === "partial"
                          ? "bg-status-partial"
                          : ctrl.status === "conflict"
                          ? "bg-status-conflict"
                          : "bg-status-missing"
                      }`}
                    />
                    <span className="font-mono text-structure-muted">
                      {ctrl.controlId}
                    </span>
                    <span className="text-structure-secondary">
                      {ctrl.title}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Linked findings */}
      {uniqueFindings.length > 0 && (
        <div className="mb-4">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Finding Relationship
          </div>
          <div className="space-y-1">
            {uniqueFindings.map((f) => (
              <div key={f.id} className="flex items-center gap-2 text-xs">
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
                <span className="text-structure-secondary">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related checklist */}
      {uniqueChecklist.length > 0 && (
        <div className="mb-4">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Related Checklist ({uniqueChecklist.length})
          </div>
          <div className="space-y-1">
            {uniqueChecklist.map((cl) => (
              <div key={cl.id} className="text-xs text-structure-secondary">
                <span
                  className={`font-sans text-2xs font-medium uppercase mr-1 ${
                    cl.priority === "must_have"
                      ? "text-status-missing"
                      : cl.priority === "should_have"
                      ? "text-status-partial"
                      : "text-structure-muted"
                  }`}
                >
                  {cl.owner}:
                </span>
                {cl.question}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 py-2 bg-status-partial/5 border border-status-partial/20 font-sans text-2xs text-status-partial">
        Synthetic evidence · Not real compliance data
      </div>
    </div>
  );
}
