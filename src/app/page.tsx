"use client";

import Link from "next/link";
import {
  controls,
  findings,
  memo,
  getControlSummary,
  getDocumentSummary,
  getFollowUpCounts,
} from "@/lib/data";

export default function HomePage() {
  const ctrlSummary = getControlSummary();
  const docSummary = getDocumentSummary();
  const followUps = getFollowUpCounts();

  const flagshipConflict = findings.find((f) => f.id === "finding-003");

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Hero */}
      <div className="mb-10 md:mb-14">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-4">
          Diligence & Compliance Analyst · Synthetic Demo
        </div>
        <h1 className="text-3xl md:text-4xl font-medium text-structure mb-4 leading-tight">
          Beacon
        </h1>
        <p className="text-base md:text-lg text-structure-secondary leading-relaxed max-w-2xl mb-8">
          A diligence analyst desk that reviews synthetic company documents,
          maps controls to evidence, identifies gaps and conflicts, and
          produces cited diligence memos. Built for portfolio demonstration.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link
            href="/room"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-structure text-surface-elevated font-sans text-xs font-medium uppercase tracking-wider hover:bg-structure-secondary transition-colors"
          >
            Review Sample Diligence Room
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/controls"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-structure text-structure font-sans text-xs font-medium uppercase tracking-wider hover:bg-structure hover:text-surface-elevated transition-colors"
          >
            View Control Map
          </Link>
          <Link
            href="/memo"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-rule text-structure-muted font-sans text-xs font-medium uppercase tracking-wider hover:border-structure hover:text-structure transition-colors"
          >
            Read the Memo
          </Link>
        </div>
      </div>

      {/* Product preview: overall posture */}
      <div className="border border-status-missing/30 bg-status-missing/5 p-5 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div>
            <div className="font-sans text-xs text-status-missing font-medium uppercase tracking-wider mb-1">
              Overall Posture
            </div>
            <div className="text-lg font-medium text-structure">
              Not Ready for Enterprise Approval
            </div>
          </div>
          <Link href="/review" className="font-sans text-2xs text-status-review hover:underline flex-shrink-0">
            Full review →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PreviewStat label="Documents" value={docSummary.total} sub="reviewed" />
          <PreviewStat label="Controls" value={ctrlSummary.total} sub="assessed" />
          <PreviewStat label="Conflicts" value={ctrlSummary.conflict} sub="detected" color="text-status-conflict" />
          <PreviewStat label="Follow-ups" value={followUps.mustHave + followUps.shouldHave} sub="generated" color="text-status-partial" />
        </div>
      </div>

      {/* Mini control map preview */}
      <div className="border border-rule bg-surface-elevated p-5 md:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-structure">Control Map Preview</h2>
          <Link href="/controls" className="font-sans text-2xs text-status-review hover:underline">
            Full control map →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <ControlCount label="Covered" count={ctrlSummary.covered} total={ctrlSummary.total} color="bg-status-covered" />
          <ControlCount label="Partial" count={ctrlSummary.partial} total={ctrlSummary.total} color="bg-status-partial" />
          <ControlCount label="Missing" count={ctrlSummary.missing} total={ctrlSummary.total} color="bg-status-missing" />
          <ControlCount label="Conflict" count={ctrlSummary.conflict} total={ctrlSummary.total} color="bg-status-conflict" />
        </div>
        <div className="space-y-1.5">
          {controls.slice(0, 6).map((ctrl) => (
            <div key={ctrl.id} className="flex items-center gap-3 text-xs">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                ctrl.status === "covered" ? "bg-status-covered" :
                ctrl.status === "partial" ? "bg-status-partial" :
                ctrl.status === "conflict" ? "bg-status-conflict" :
                "bg-status-missing"
              }`} />
              <span className="font-mono text-structure-muted w-12 flex-shrink-0">{ctrl.controlId}</span>
              <span className="text-structure-secondary truncate">{ctrl.title}</span>
              <span className={`font-sans text-2xs uppercase ml-auto flex-shrink-0 ${
                ctrl.status === "covered" ? "text-status-covered" :
                ctrl.status === "partial" ? "text-status-partial" :
                ctrl.status === "conflict" ? "text-status-conflict" :
                "text-status-missing"
              }`}>{ctrl.status}</span>
            </div>
          ))}
          <div className="text-2xs text-structure-muted font-sans pt-1">
            + {controls.length - 6} more controls
          </div>
        </div>
      </div>

      {/* Flagship conflict preview */}
      {flagshipConflict && (
        <div className="border border-status-conflict/30 bg-status-conflict/5 p-5 md:p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="font-sans text-xs text-status-conflict font-medium uppercase tracking-wider">
              Key Conflict Detected
            </div>
            <Link href="/evidence" className="font-sans text-2xs text-status-review hover:underline">
              Full evidence graph →
            </Link>
          </div>
          <h3 className="text-base font-medium text-structure mb-3">
            {flagshipConflict.title}
          </h3>
          <p className="text-xs text-structure-secondary mb-3">
            {flagshipConflict.description}
          </p>
          <div className="text-xs text-structure-muted">
            {flagshipConflict.recommendation}
          </div>
        </div>
      )}

      {/* Cited memo preview */}
      <div className="border border-rule bg-surface-elevated p-5 md:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-structure">Memo Preview</h2>
          <Link href="/memo" className="font-sans text-2xs text-status-review hover:underline">
            Full memo →
          </Link>
        </div>
        <div className="mb-4">
          <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">
            Executive Summary
          </div>
          <p className="text-sm text-structure-secondary leading-relaxed">
            {memo.executiveSummary}
          </p>
        </div>
        <div className="text-xs text-structure-muted">
          {memo.sections.length} sections · {memo.disclaimers.length} disclaimers ·{" "}
          <span className="text-status-review">Not legal advice</span>
        </div>
      </div>

      {/* Disclosure */}
      <div className="border border-status-partial/30 bg-status-partial/5 p-4 md:p-5 mb-8">
        <div className="font-sans text-xs text-status-partial font-medium uppercase tracking-wider mb-2">
          Synthetic Demo · Not Legal Advice
        </div>
        <p className="text-sm text-structure-secondary leading-relaxed">
          Beacon uses synthetic data for a fictional company (NovaPay AI). No real
          compliance certifications, legal advice, or company data is represented.
          All findings are deterministic and generated from synthetic documents for
          illustration purposes only.
        </p>
      </div>

      {/* Review question */}
      <div className="border-t border-rule pt-8">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
          Primary Review Question
        </div>
        <blockquote className="text-base md:text-lg text-structure italic leading-relaxed">
          &ldquo;Is NovaPay AI ready for enterprise diligence, what evidence
          supports that, what gaps remain, and what should we ask before
          approval?&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

function PreviewStat({ label, value, sub, color }: { label: string; value: number; sub: string; color?: string }) {
  return (
    <div>
      <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-xl font-medium ${color ?? "text-structure"}`}>{value}</span>
        <span className="font-sans text-2xs text-structure-muted">{sub}</span>
      </div>
    </div>
  );
}

function ControlCount({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-sans text-2xs text-structure-muted">{label}</span>
        <span className="font-sans text-2xs text-structure-muted">{count}/{total}</span>
      </div>
      <div className="h-1.5 bg-surface-sunken rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
