"use client";

import { useState } from "react";
import {
  documents,
  getDocumentSummary,
  getEvidenceForDocument,
  getControlByCode,
  getSectionsForDocument,
  getFindingsForControl,
} from "@/lib/data";
import type { DiligenceDocument, DocumentSection } from "@/lib/domain/types";

const categoryLabels: Record<string, string> = {
  policy: "Policy",
  contract: "Contract",
  security: "Security",
  hr: "HR",
  financial: "Financial",
  technical: "Technical",
};

const statusStyles: Record<string, { bg: string; label: string }> = {
  current: { bg: "bg-status-covered text-white", label: "Current" },
  expired: { bg: "bg-status-missing text-white", label: "Expired" },
  missing: { bg: "bg-structure-muted text-white", label: "Missing" },
  draft: { bg: "bg-status-partial text-white", label: "Draft" },
};

const riskStyles: Record<string, string> = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-risk-high",
  critical: "text-risk-critical",
};

export default function RoomPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const summary = getDocumentSummary();
  const selected = selectedId
    ? documents.find((d) => d.id === selectedId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-2">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Diligence Room
        </div>
        <h1 className="text-2xl font-medium text-structure mb-2">
          NovaPay AI — Document Repository
        </h1>
      </div>
      <div className="mb-8 px-3 py-2 bg-status-partial/5 border border-status-partial/20 inline-block font-sans text-2xs text-status-partial uppercase tracking-wider">
        Synthetic Diligence Room · No Real Company Data
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Documents" value={summary.total} />
        <StatCard
          label="Current"
          value={summary.current}
          color="text-status-covered"
        />
        <StatCard
          label="Expired"
          value={summary.expired}
          color="text-status-missing"
        />
        <StatCard
          label="Missing"
          value={summary.missing}
          color="text-structure-muted"
        />
        <StatCard
          label="Draft"
          value={summary.draft}
          color="text-status-partial"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Document grid */}
        <div className={selected ? "lg:w-80 flex-shrink-0" : "flex-1"}>
          <div className={`grid gap-3 ${selected ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                selected={selectedId === doc.id}
                onClick={() =>
                  setSelectedId(selectedId === doc.id ? null : doc.id)
                }
              />
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="flex-1 min-w-0">
            <DocumentDetail
              doc={selected}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="p-4 border border-rule bg-surface-elevated">
      <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-xl font-medium ${color ?? "text-structure"}`}>
        {value}
      </div>
    </div>
  );
}

function DocumentRow({
  doc,
  selected,
  onClick,
}: {
  doc: DiligenceDocument;
  selected: boolean;
  onClick: () => void;
}) {
  const docEvidence = getEvidenceForDocument(doc.id);
  const status = statusStyles[doc.status];

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
          {categoryLabels[doc.category]}
        </div>
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 font-sans text-2xs font-medium uppercase tracking-wider ${status.bg}`}
        >
          {status.label}
        </span>
      </div>
      <h3 className="text-sm font-medium text-structure leading-snug mb-2">
        {doc.title}
      </h3>
      <div className="flex items-center gap-4 font-sans text-2xs text-structure-muted">
        {doc.sectionCount > 0 && <span>{doc.sectionCount} sections</span>}
        {docEvidence.length > 0 && (
          <span>{docEvidence.length} evidence</span>
        )}
        {doc.controlDomains.length > 0 && (
          <span>{doc.controlDomains.length} controls</span>
        )}
        <span className={riskStyles[doc.riskRelevance]}>
          {doc.riskRelevance} risk
        </span>
      </div>
    </button>
  );
}

function DocumentDetail({
  doc,
  onClose,
}: {
  doc: DiligenceDocument;
  onClose: () => void;
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const docEvidence = getEvidenceForDocument(doc.id);
  const sections = getSectionsForDocument(doc.id);
  const status = statusStyles[doc.status];

  // Collect all linked findings through controls
  const linkedFindings = doc.controlDomains.flatMap((cid) =>
    getFindingsForControl(cid)
  );
  const uniqueFindings = linkedFindings.filter(
    (f, i, arr) => arr.findIndex((x) => x.id === f.id) === i
  );

  // Get evidence for active section
  const activeSectionData = activeSection
    ? sections.find((s) => s.id === activeSection)
    : null;
  const sectionEvidence = activeSectionData
    ? docEvidence.filter((e) =>
        activeSectionData.evidenceIds.includes(e.id)
      )
    : [];

  return (
    <div className="border border-rule bg-surface-elevated">
      {/* Header */}
      <div className="p-5 border-b border-rule">
        <div className="flex items-start justify-between mb-3">
          <span
            className={`inline-flex items-center rounded px-1.5 py-0.5 font-sans text-2xs font-medium uppercase tracking-wider ${status.bg}`}
          >
            {status.label}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-2xs text-structure-muted hover:text-structure"
          >
            Close
          </button>
        </div>
        <h2 className="text-lg font-medium text-structure mb-1">{doc.title}</h2>
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider">
          {categoryLabels[doc.category]}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 border-b border-rule">
        <p className="text-sm text-structure-secondary leading-relaxed">
          {doc.content}
        </p>
      </div>

      {/* Metadata */}
      {Object.keys(doc.metadata).length > 0 && (
        <div className="p-5 border-b border-rule">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
            Document Metadata
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(doc.metadata).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-sans text-2xs text-structure-muted capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="font-sans text-2xs text-structure-secondary">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section navigation */}
      {sections.length > 0 && (
        <div className="p-5 border-b border-rule">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
            Sections ({sections.length})
          </div>
          <div className="space-y-1">
            {sections.map((section) => (
              <SectionRow
                key={section.id}
                section={section}
                active={activeSection === section.id}
                onClick={() =>
                  setActiveSection(
                    activeSection === section.id ? null : section.id
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Section evidence detail */}
      {activeSectionData && sectionEvidence.length > 0 && (
        <div className="p-5 border-b border-rule bg-surface-sunken/30">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
            Evidence in {activeSectionData.title}
          </div>
          <div className="space-y-3">
            {sectionEvidence.map((ev) => {
              const relatedControls = ev.controlIds
                .map((cid) => getControlByCode(cid))
                .filter(Boolean);
              return (
                <div
                  key={ev.id}
                  className="p-3 bg-surface-elevated border border-rule"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans text-2xs font-mono text-status-review">
                      [{ev.id}]
                    </span>
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
                  <blockquote className="text-xs text-structure leading-relaxed border-l-2 border-status-review pl-3 mb-2">
                    &ldquo;{ev.excerpt}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-2 flex-wrap">
                    {relatedControls.map(
                      (ctrl) =>
                        ctrl && (
                          <span
                            key={ctrl.id}
                            className={`font-sans text-2xs font-mono px-1.5 py-0.5 ${
                              ctrl.status === "covered"
                                ? "bg-status-covered/10 text-status-covered"
                                : ctrl.status === "partial"
                                ? "bg-status-partial/10 text-status-partial"
                                : ctrl.status === "conflict"
                                ? "bg-status-conflict/10 text-status-conflict"
                                : "bg-status-missing/10 text-status-missing"
                            }`}
                          >
                            {ctrl.controlId}: {ctrl.status}
                          </span>
                        )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Linked controls */}
      {doc.controlDomains.length > 0 && (
        <div className="p-5 border-b border-rule">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
            Linked Controls
          </div>
          <div className="flex flex-wrap gap-2">
            {doc.controlDomains.map((cid) => {
              const ctrl = getControlByCode(cid);
              return (
                <span
                  key={cid}
                  className={`font-sans text-2xs font-mono px-2 py-1 ${
                    ctrl
                      ? ctrl.status === "covered"
                        ? "bg-status-covered/10 text-status-covered"
                        : ctrl.status === "partial"
                        ? "bg-status-partial/10 text-status-partial"
                        : ctrl.status === "conflict"
                        ? "bg-status-conflict/10 text-status-conflict"
                        : "bg-status-missing/10 text-status-missing"
                      : "bg-surface-sunken text-structure-muted"
                  }`}
                >
                  {cid}
                  {ctrl && ` · ${ctrl.status}`}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Linked findings */}
      {uniqueFindings.length > 0 && (
        <div className="p-5">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
            Related Findings ({uniqueFindings.length})
          </div>
          <div className="space-y-2">
            {uniqueFindings.map((f) => (
              <div
                key={f.id}
                className="flex items-start gap-2 p-2 bg-surface-sunken border border-rule"
              >
                <span
                  className={`inline-flex items-center rounded px-1 py-0.5 font-sans text-2xs font-medium uppercase tracking-wider text-white flex-shrink-0 ${
                    f.severity === "critical"
                      ? "bg-risk-critical"
                      : f.severity === "high"
                      ? "bg-risk-high"
                      : "bg-risk-medium"
                  }`}
                >
                  {f.severity}
                </span>
                <div>
                  <div className="text-xs font-medium text-structure">
                    {f.title}
                  </div>
                  <div className="font-sans text-2xs text-structure-muted capitalize">
                    {f.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionRow({
  section,
  active,
  onClick,
}: {
  section: DocumentSection;
  active: boolean;
  onClick: () => void;
}) {
  const hasEvidence = section.evidenceIds.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
        active
          ? "bg-status-review/10 border border-status-review/30"
          : "border border-transparent hover:bg-surface-sunken"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-sans text-2xs text-structure-muted w-6">
          §{section.order}
        </span>
        <span className="text-xs text-structure">{section.title}</span>
      </div>
      {hasEvidence && (
        <span className="w-2 h-2 rounded-full bg-status-review" />
      )}
    </button>
  );
}
