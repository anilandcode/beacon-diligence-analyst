"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  documents,
  evidence,
  controls,
  findings,
  checklist,
} from "@/data/novapay";

interface SearchResult {
  id: string;
  type: "document" | "evidence" | "control" | "finding" | "checklist";
  title: string;
  excerpt: string;
  href: string;
  status?: string;
}

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    const out: SearchResult[] = [];

    for (const doc of documents) {
      if (
        doc.title.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q)
      ) {
        out.push({
          id: doc.id,
          type: "document",
          title: doc.title,
          excerpt: doc.content.slice(0, 120),
          href: "/room",
          status: doc.status,
        });
      }
    }

    for (const ev of evidence) {
      if (
        ev.excerpt.toLowerCase().includes(q) ||
        ev.citation.toLowerCase().includes(q)
      ) {
        out.push({
          id: ev.id,
          type: "evidence",
          title: `[${ev.id}] ${ev.pageOrSection}`,
          excerpt: ev.excerpt.slice(0, 120),
          href: "/evidence",
          status: ev.confidence,
        });
      }
    }

    for (const ctrl of controls) {
      if (
        ctrl.title.toLowerCase().includes(q) ||
        ctrl.controlId.toLowerCase().includes(q) ||
        ctrl.description.toLowerCase().includes(q)
      ) {
        out.push({
          id: ctrl.id,
          type: "control",
          title: `${ctrl.controlId} — ${ctrl.title}`,
          excerpt: ctrl.description.slice(0, 120),
          href: "/controls",
          status: ctrl.status,
        });
      }
    }

    for (const f of findings) {
      if (
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      ) {
        out.push({
          id: f.id,
          type: "finding",
          title: f.title,
          excerpt: f.description.slice(0, 120),
          href: "/review",
          status: f.severity,
        });
      }
    }

    for (const cl of checklist) {
      if (
        cl.question.toLowerCase().includes(q) ||
        cl.reason.toLowerCase().includes(q)
      ) {
        out.push({
          id: cl.id,
          type: "checklist",
          title: cl.question.slice(0, 80),
          excerpt: cl.reason.slice(0, 120),
          href: "/checklist",
          status: cl.priority,
        });
      }
    }

    return out.slice(0, 20);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-structure/20 z-40" onClick={onClose} />
      <div className="fixed top-[10%] left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-xl bg-surface-elevated border border-rule shadow-lg">
        <div className="p-4 border-b border-rule">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documents, evidence, controls, findings..."
            className="w-full text-sm text-structure bg-transparent outline-none placeholder:text-structure-muted"
            autoFocus
          />
        </div>

        {query.length >= 2 && (
          <div className="max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-4 text-center font-sans text-xs text-structure-muted">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="divide-y divide-rule">
                {results.map((r) => (
                  <Link
                    key={`${r.type}-${r.id}`}
                    href={r.href}
                    onClick={onClose}
                    className="block p-3 hover:bg-surface-sunken/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-2xs text-structure-muted uppercase tracking-wider bg-surface-sunken px-1.5 py-0.5">
                        {r.type}
                      </span>
                      <span className="text-xs font-medium text-structure truncate">
                        {r.title}
                      </span>
                      {r.status && (
                        <span className="font-sans text-2xs text-structure-muted ml-auto flex-shrink-0">
                          {r.status}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-structure-secondary truncate">
                      {r.excerpt}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="p-4 text-center font-sans text-xs text-structure-muted">
            Type at least 2 characters to search
          </div>
        )}

        <div className="px-4 py-2 border-t border-rule font-sans text-2xs text-structure-muted">
          Esc to close · Deterministic local search · No model calls
        </div>
      </div>
    </>
  );
}
