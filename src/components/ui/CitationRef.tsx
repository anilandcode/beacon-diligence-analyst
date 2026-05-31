"use client";

import { useState } from "react";
import type { Evidence } from "@/lib/domain/types";

interface CitationRefProps {
  index: number;
  evidence: Evidence;
}

export function CitationRef({ index, evidence }: CitationRefProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline">
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 text-2xs font-sans font-semibold text-status-review bg-status-review/10 rounded hover:bg-status-review/20 transition-colors cursor-pointer align-super"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Citation ${index}`}
      >
        {index}
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 bottom-full mb-2 z-20 w-72 p-3 bg-surface-elevated border border-rule shadow-lg rounded">
            <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
              Source
            </div>
            <div className="font-sans text-xs text-structure font-medium mb-2">
              {evidence.citation}
            </div>
            <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
              Excerpt
            </div>
            <div className="text-xs text-structure-secondary leading-relaxed">
              &ldquo;{evidence.excerpt}&rdquo;
            </div>
            <div className="mt-2 flex items-center gap-2">
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
        </>
      )}
    </span>
  );
}
