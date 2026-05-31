"use client";

import { useState } from "react";
import {
  memo,
  documents,
  checklist,
  getControlSummary,
  getEvidence,
  getDocument,
  getControlByCode,
} from "@/lib/data";
import { ExportButton } from "@/components/ui/ExportButton";

export default function MemoPage() {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const ctrlSummary = getControlSummary();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2 no-print">
            Diligence Memo Preview
          </div>
          <h1 className="text-xl md:text-2xl font-medium text-structure">
            NovaPay AI — Diligence Review
          </h1>
        </div>
        <ExportButton label="Print Preview" />
      </div>

      {/* Memo document */}
      <div className="memo-document bg-surface-elevated border border-rule p-6 md:p-8 lg:p-12">
        {/* Memo header */}
        <div className="mb-8 pb-6 border-b border-rule">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-4">
            Diligence & Compliance Memo
          </div>
          <div className="space-y-1 text-sm text-structure-secondary">
            <div>
              <span className="font-medium text-structure">Subject:</span>{" "}
              {memo.subject}
            </div>
            <div>
              <span className="font-medium text-structure">Date:</span>{" "}
              {memo.generatedAt}
            </div>
            <div>
              <span className="font-medium text-structure">Classification:</span>{" "}
              Synthetic Demo — Not Legal Advice
            </div>
            <div>
              <span className="font-medium text-structure">Documents Reviewed:</span>{" "}
              {documents.length} ({documents.filter((d) => d.status === "current").length} current,{" "}
              {documents.filter((d) => d.status === "expired").length} expired,{" "}
              {documents.filter((d) => d.status === "missing").length} missing,{" "}
              {documents.filter((d) => d.status === "draft").length} draft)
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
            Executive Summary
          </h2>
          <p className="text-sm text-structure-secondary leading-relaxed">
            {memo.executiveSummary}
          </p>
        </section>

        {/* Reviewed Documents */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
            Reviewed Documents
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {documents
              .filter((d) => d.status !== "missing")
              .map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      doc.status === "current"
                        ? "bg-status-covered"
                        : doc.status === "expired"
                        ? "bg-status-missing"
                        : "bg-status-partial"
                    }`}
                  />
                  <span className="text-structure-secondary">{doc.title}</span>
                  <span className="font-sans text-2xs text-structure-muted">
                    ({doc.status})
                  </span>
                </div>
              ))}
            {documents
              .filter((d) => d.status === "missing")
              .map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-structure-muted flex-shrink-0" />
                  <span className="text-structure-muted italic">
                    {doc.title} — not provided
                  </span>
                </div>
              ))}
          </div>
        </section>

        {/* Memo sections with citation links */}
        {memo.sections.map((section) => (
          <section key={section.id} className="mb-8">
            <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
              {section.title}
            </h2>
            <MemoContentWithCitations
              content={section.content}
              onCitationClick={setSelectedEvidence}
            />
          </section>
        ))}

        {/* Control Map Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
            Control Map Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 border border-rule text-center">
              <div className="text-lg font-medium text-status-covered">
                {ctrlSummary.covered}
              </div>
              <div className="font-sans text-2xs text-structure-muted uppercase">
                Covered
              </div>
            </div>
            <div className="p-3 border border-rule text-center">
              <div className="text-lg font-medium text-status-partial">
                {ctrlSummary.partial}
              </div>
              <div className="font-sans text-2xs text-structure-muted uppercase">
                Partial
              </div>
            </div>
            <div className="p-3 border border-rule text-center">
              <div className="text-lg font-medium text-status-missing">
                {ctrlSummary.missing}
              </div>
              <div className="font-sans text-2xs text-structure-muted uppercase">
                Missing
              </div>
            </div>
            <div className="p-3 border border-rule text-center">
              <div className="text-lg font-medium text-status-conflict">
                {ctrlSummary.conflict}
              </div>
              <div className="font-sans text-2xs text-structure-muted uppercase">
                Conflict
              </div>
            </div>
          </div>
        </section>

        {/* Follow-Up Checklist */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
            Follow-Up Checklist
          </h2>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 text-sm text-structure-secondary"
              >
                <span
                  className={`flex-shrink-0 font-sans text-2xs font-medium uppercase tracking-wider mt-0.5 w-16 ${
                    item.priority === "must_have"
                      ? "text-status-missing"
                      : item.priority === "should_have"
                      ? "text-status-partial"
                      : "text-structure-muted"
                  }`}
                >
                  {item.priority.replace(/_/g, " ")}
                </span>
                <span>{item.question}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
            Conclusion
          </h2>
          <p className="text-sm text-structure-secondary leading-relaxed font-medium">
            {memo.conclusion}
          </p>
        </section>

        {/* Disclaimers */}
        <div className="border-t border-rule pt-6">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
            Limitations & Disclaimers
          </div>
          <ul className="space-y-2 text-xs text-structure-muted">
            {memo.disclaimers.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evidence inspector overlay */}
      {selectedEvidence && (
        <EvidenceOverlay
          evidenceId={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}
    </div>
  );
}

function MemoContentWithCitations({
  content,
  onCitationClick,
}: {
  content: string;
  onCitationClick: (id: string) => void;
}) {
  // Parse [ev-XXX] citation markers
  const parts = content.split(/(\[ev-\d{3}\])/g);

  return (
    <p className="text-sm text-structure-secondary leading-relaxed">
      {parts.map((part, i) => {
        const match = part.match(/\[(ev-\d{3})\]/);
        if (match) {
          const evId = match[1];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onCitationClick(evId)}
              className="inline-flex items-center font-sans text-2xs font-mono text-status-review bg-status-review/10 px-1 py-0.5 mx-0.5 hover:bg-status-review/20 transition-colors cursor-pointer align-baseline"
            >
              [{evId}]
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function EvidenceOverlay({
  evidenceId,
  onClose,
}: {
  evidenceId: string;
  onClose: () => void;
}) {
  const ev = getEvidence(evidenceId);
  if (!ev) return null;

  const doc = getDocument(ev.documentId);
  const linkedControls = ev.controlIds
    .map((cid) => getControlByCode(cid))
    .filter(Boolean);

  return (
    <>
      <div
        className="fixed inset-0 bg-structure/20 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] max-h-[80vh] overflow-y-auto bg-surface-elevated border border-rule shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="font-sans text-xs font-mono text-status-review">
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

        <h3 className="text-base font-medium text-structure mb-1">
          {doc?.title ?? "Unknown Document"}
        </h3>
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-4">
          {ev.pageOrSection}
        </div>

        <blockquote className="text-sm text-structure leading-relaxed border-l-2 border-status-review pl-4 mb-4">
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

        {linkedControls.length > 0 && (
          <div className="mb-4">
            <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
              Linked Controls
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

        <div className="px-3 py-2 bg-status-partial/5 border border-status-partial/20 font-sans text-2xs text-status-partial">
          Synthetic evidence · Not real compliance data
        </div>
      </div>
    </>
  );
}
