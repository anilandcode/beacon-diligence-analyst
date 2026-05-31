"use client";

import { useState } from "react";
import type { Evidence } from "@/lib/domain/types";
import { getDocument } from "@/lib/data";

interface CitationChipProps {
  evidence: Evidence;
  compact?: boolean;
}

export function CitationChip({ evidence, compact }: CitationChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const doc = getDocument(evidence.documentId);

  return (
    <span className="relative inline">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center font-sans text-2xs font-medium border transition-colors cursor-pointer ${
          isOpen
            ? "border-status-review bg-status-review/10 text-status-review"
            : "border-rule hover:border-status-review hover:text-status-review text-structure-muted"
        } ${compact ? "px-1 py-0.5" : "px-1.5 py-0.5"}`}
      >
        {evidence.id}
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 bottom-full mb-2 z-20 w-80 p-4 bg-surface-elevated border border-rule shadow-lg text-left">
            <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
              Source Document
            </div>
            <div className="font-sans text-xs text-structure font-medium mb-3">
              {doc?.title ?? "Unknown"} — {evidence.pageOrSection}
            </div>
            <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
              Excerpt
            </div>
            <blockquote className="text-xs text-structure-secondary leading-relaxed border-l-2 border-rule pl-3 mb-3">
              &ldquo;{evidence.excerpt}&rdquo;
            </blockquote>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-sans text-2xs text-structure-muted">
                  Controls:
                </span>
                {evidence.controlIds.map((cid) => (
                  <span
                    key={cid}
                    className="font-sans text-2xs font-mono text-structure-muted bg-surface-sunken px-1"
                  >
                    {cid}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-sans text-2xs text-structure-muted">
                  Confidence:
                </span>
                <span
                  className={`font-sans text-2xs font-medium ${
                    evidence.confidence === "high"
                      ? "text-status-covered"
                      : evidence.confidence === "medium"
                      ? "text-status-partial"
                      : "text-status-missing"
                  }`}
                >
                  {evidence.confidence}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </span>
  );
}
