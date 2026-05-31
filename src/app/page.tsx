import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
      {/* Hero */}
      <div className="mb-12 md:mb-16">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-4">
          Diligence & Compliance Analyst
        </div>
        <h1 className="text-3xl md:text-4xl font-medium text-structure mb-4 md:mb-6 leading-tight">
          Beacon
        </h1>
        <p className="text-base md:text-lg text-structure-secondary leading-relaxed max-w-2xl mb-6 md:mb-8">
          A diligence and compliance analyst desk that reviews synthetic company
          documents, maps controls to evidence, identifies gaps and risks, and
          produces cited diligence memos.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Link
            href="/room"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-structure text-surface-elevated font-sans text-xs font-medium uppercase tracking-wider hover:bg-structure-secondary transition-colors"
          >
            Enter Diligence Room
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
          <Link
            href="/about"
            className="font-sans text-xs text-structure-muted uppercase tracking-wider hover:text-structure transition-colors"
          >
            Learn more
          </Link>
        </div>
      </div>

      {/* Demo context */}
      <div className="border border-status-partial/30 bg-status-partial/5 p-4 md:p-6 mb-12 md:mb-16">
        <div className="font-sans text-xs text-status-partial font-medium uppercase tracking-wider mb-2">
          Synthetic Demo
        </div>
        <p className="text-sm text-structure-secondary leading-relaxed">
          This is a portfolio demonstration using synthetic data for a fictional
          company, NovaPay AI. No real compliance certifications, legal advice,
          or company data is represented. All findings are generated from
          synthetic documents for illustration purposes only.
        </p>
      </div>

      {/* What Beacon does */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
        <div>
          <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
            What Beacon Reviews
          </h2>
          <ul className="space-y-3 text-sm text-structure-secondary">
            <li className="flex items-start gap-2">
              <span className="status-dot status-dot--covered mt-1.5 flex-shrink-0" />
              <span>Information security policies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="status-dot status-dot--partial mt-1.5 flex-shrink-0" />
              <span>Data processing agreements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="status-dot status-dot--missing mt-1.5 flex-shrink-0" />
              <span>Business continuity plans</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="status-dot status-dot--conflict mt-1.5 flex-shrink-0" />
              <span>Vendor and sub-processor documentation</span>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
            What Beacon Produces
          </h2>
          <ul className="space-y-3 text-sm text-structure-secondary">
            <li className="flex items-start gap-2">
              <span className="font-sans text-xs text-structure-muted mr-1">→</span>
              <span>Cited diligence memo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-sans text-xs text-structure-muted mr-1">→</span>
              <span>Control-to-evidence map</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-sans text-xs text-structure-muted mr-1">→</span>
              <span>Risk and gap classification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-sans text-xs text-structure-muted mr-1">→</span>
              <span>Follow-up checklist</span>
            </li>
          </ul>
        </div>
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
