"use client";

import { useState } from "react";
import evalResults from "@/data/novapay/eval-results.json";

const categoryLabels: Record<string, string> = {
  citation_coverage: "Citation Coverage",
  control_status: "Control Status Correctness",
  missing_evidence: "Missing Evidence Detection",
  conflict_detection: "Conflict Detection",
  checklist_relevance: "Checklist Relevance",
  no_legal_advice: "No Legal Advice Language",
  synthetic_disclosure: "Synthetic Disclosure",
};

export default function EvalsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { summary, categories, results, dataset, timestamp, mode } = evalResults;

  const filteredResults = activeCategory
    ? results.filter((r) => r.category === activeCategory)
    : results;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Evaluations
        </div>
        <h1 className="text-2xl font-medium text-structure mb-2">
          Eval Dashboard
        </h1>
        <p className="text-sm text-structure-secondary">
          Deterministic evaluation of the synthetic NovaPay AI diligence dataset.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-8 border border-status-partial/30 bg-status-partial/5 p-5">
        <div className="font-sans text-xs text-status-partial font-medium uppercase tracking-wider mb-2">
          Benchmark Provenance
        </div>
        <p className="text-sm text-structure-secondary leading-relaxed mb-3">
          These results validate deterministic behaviours in a synthetic demo.
          Beacon does not provide legal, security, or compliance advice.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-structure-muted">Mode:</span>{" "}
            <span className="font-mono text-structure-secondary">{mode}</span>
          </div>
          <div>
            <span className="text-structure-muted">Live model calls:</span>{" "}
            <span className="font-mono text-status-covered">None</span>
          </div>
          <div>
            <span className="text-structure-muted">Data:</span>{" "}
            <span className="font-mono text-structure-secondary">Synthetic only</span>
          </div>
          <div>
            <span className="text-structure-muted">Run:</span>{" "}
            <span className="font-mono text-structure-secondary">
              {new Date(timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 border border-rule bg-surface-elevated">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Total Tests
          </div>
          <div className="text-2xl font-medium text-structure">
            {summary.total}
          </div>
        </div>
        <div className="p-4 border border-rule bg-surface-elevated">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Passed
          </div>
          <div className="text-2xl font-medium text-status-covered">
            {summary.passed}
          </div>
        </div>
        <div className="p-4 border border-rule bg-surface-elevated">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Failed
          </div>
          <div className="text-2xl font-medium text-status-missing">
            {summary.failed}
          </div>
        </div>
        <div className="p-4 border border-rule bg-surface-elevated">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
            Dataset
          </div>
          <div className="text-sm font-medium text-structure">
            {dataset.documents} docs · {dataset.controls} controls
          </div>
        </div>
      </div>

      {/* Category results */}
      <div className="border border-rule bg-surface-elevated mb-8">
        <div className="p-5 border-b border-rule">
          <h2 className="text-sm font-medium text-structure">
            Category Results
          </h2>
        </div>
        <div className="divide-y divide-rule">
          {categories.map((cat) => {
            const pct = Math.round((cat.passed / cat.total) * 100);
            const isActive = activeCategory === cat.category;
            return (
              <button
                key={cat.category}
                type="button"
                onClick={() =>
                  setActiveCategory(isActive ? null : cat.category)
                }
                className={`w-full text-left p-4 transition-colors ${
                  isActive ? "bg-status-review/5" : "hover:bg-surface-sunken/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cat.failed === 0 ? "bg-status-covered" : "bg-status-missing"
                      }`}
                    />
                    <span className="text-sm text-structure">
                      {categoryLabels[cat.category] ?? cat.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-xs text-structure-muted">
                      {cat.passed}/{cat.total}
                    </span>
                    <span
                      className={`font-sans text-xs font-medium ${
                        cat.failed === 0
                          ? "text-status-covered"
                          : "text-status-missing"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.failed === 0 ? "bg-status-covered" : "bg-status-missing"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual test results */}
      <div className="border border-rule bg-surface-elevated">
        <div className="p-5 border-b border-rule flex items-center justify-between">
          <h2 className="text-sm font-medium text-structure">
            Test Results
            {activeCategory && (
              <span className="font-sans text-2xs text-structure-muted ml-2">
                ({categoryLabels[activeCategory]})
              </span>
            )}
          </h2>
          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="font-sans text-2xs text-status-review"
            >
              Show all
            </button>
          )}
        </div>
        <div className="divide-y divide-rule max-h-[600px] overflow-y-auto">
          {filteredResults.map((result) => (
            <div key={result.id} className="p-4">
              <div className="flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    result.passed ? "bg-status-covered" : "bg-status-missing"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-structure mb-1">
                    {result.name}
                  </div>
                  <div className="font-sans text-2xs text-structure-muted">
                    {result.detail}
                  </div>
                </div>
                <span className="font-sans text-2xs font-mono text-structure-muted flex-shrink-0">
                  {result.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Known limitations */}
      <div className="mt-8 border border-rule bg-surface-elevated p-5">
        <h2 className="text-sm font-medium text-structure mb-3">
          Known Limitations
        </h2>
        <ul className="space-y-2 text-xs text-structure-secondary">
          <li className="flex items-start gap-2">
            <span className="text-structure-muted">•</span>
            <span>
              This harness evaluates a fixed synthetic dataset. It does not
              validate real-world document parsing or extraction accuracy.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-structure-muted">•</span>
            <span>
              Control status correctness checks are structural (evidence exists,
              count matches) rather than semantic (evidence content is correct).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-structure-muted">•</span>
            <span>
              No live model calls are made. All results are deterministic and
              reproducible against the same dataset.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-structure-muted">•</span>
            <span>
              Language safety checks (no legal advice, synthetic disclosure) are
              pattern-based, not semantic.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
