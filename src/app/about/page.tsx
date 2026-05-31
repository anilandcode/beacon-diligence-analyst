import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Portfolio Case Study
        </div>
        <h1 className="text-2xl md:text-3xl font-medium text-structure mb-3">
          Beacon — Diligence & Compliance Analyst
        </h1>
        <p className="text-sm text-structure-secondary">
          A standalone product demo for an AI Engineer / AI Architect portfolio.
        </p>
      </div>

      {/* Problem */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Problem
        </h2>
        <p className="text-sm text-structure-secondary leading-relaxed mb-4">
          Enterprise diligence requires reviewing dozens of documents — policies,
          contracts, security reports, financial audits — and mapping them against
          compliance frameworks. This process is manual, error-prone, and produces
          inconsistent results across reviewers.
        </p>
        <p className="text-sm text-structure-secondary leading-relaxed">
          A diligence analyst must answer: <em>Is this company ready for enterprise
          approval, what evidence supports that, what gaps remain, and what should
          we ask before approving?</em>
        </p>
      </section>

      {/* Product concept */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Product Concept
        </h2>
        <p className="text-sm text-structure-secondary leading-relaxed mb-4">
          Beacon is a deterministic diligence analyst desk that reviews a synthetic
          diligence room for NovaPay AI, a fictional fintech AI startup. It
          produces a cited diligence memo, control map, evidence graph, risk/gap
          classification, and follow-up checklist.
        </p>
        <blockquote className="text-sm text-structure italic leading-relaxed border-l-2 border-rule pl-4 mb-4">
          &ldquo;Is NovaPay AI ready for enterprise diligence, what evidence
          supports that, what gaps remain, and what should we ask before approval?&rdquo;
        </blockquote>
      </section>

      {/* Architecture challenge */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Architecture Challenge
        </h2>
        <div className="space-y-4 text-sm text-structure-secondary leading-relaxed">
          <p>
            <strong className="text-structure">Zero runtime AI cost.</strong>{" "}
            The public demo uses deterministic synthetic data and local text
            matching. No model calls, no API keys, no vector DB. The architecture
            is designed so a live AI layer can be added behind a feature flag
            without changing the public experience.
          </p>
          <p>
            <strong className="text-structure">Every finding must be traceable.</strong>{" "}
            Each finding in the memo cites supporting evidence, conflicting
            evidence, or is explicitly marked as missing/unsupported. No
            unsupported claims are allowed.
          </p>
          <p>
            <strong className="text-structure">Designed gaps and conflicts.</strong>{" "}
            The synthetic dataset includes deliberate contradictions (AI data-use
            policy vs. MSA, DPA vs. privacy policy retention periods) and gaps
            (missing BCP, expired SOC 2) to create realistic analysis scenarios.
          </p>
        </div>
      </section>

      {/* What I built */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          What I Built
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { title: "Cited Diligence Memo", desc: "Professional memo with evidence citations and disclaimers" },
            { title: "Control Map", desc: "SOC2, ISO27001, GDPR controls mapped to evidence" },
            { title: "Evidence Graph", desc: "Document → evidence → control → finding → follow-up traceability" },
            { title: "Risk & Gap Classification", desc: "Critical, high, medium, low severity findings" },
            { title: "Follow-Up Checklist", desc: "Prioritized questions grouped by owner" },
            { title: "Eval Dashboard", desc: "85 deterministic tests across 7 categories" },
          ].map((item) => (
            <div key={item.title} className="p-3 border border-rule bg-surface-elevated">
              <div className="text-sm font-medium text-structure mb-1">{item.title}</div>
              <div className="text-xs text-structure-secondary">{item.desc}</div>
            </div>
          ))}
        </div>
        <ul className="space-y-1.5 text-sm text-structure-secondary">
          {[
            "Next.js 14 App Router with TypeScript and Tailwind CSS",
            "Zod-validated domain model: documents, controls, evidence, findings, checklist, memo",
            "18 synthetic documents with 76 sections and 12 evidence excerpts",
            "16 controls across SOC2, ISO27001, GDPR, and custom frameworks",
            "9 findings with severity classification and recommendations",
            "10 follow-up checklist items grouped by Legal, Security, CTO/Product",
            "Deterministic eval harness with 85 tests across 7 categories",
            "Responsive design for desktop, tablet, and mobile",
            "Print-optimized memo export via browser print dialog",
            "Local search across all data surfaces",
            "Evidence graph with 5 scenarios showing traceability chains",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="font-sans text-xs text-structure-muted mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How Beacon differs */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          How Beacon Differs from a Document Chatbot
        </h2>
        <div className="border border-rule bg-surface-elevated">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
            <div className="p-5">
              <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-3">
                Document Chatbot
              </div>
              <ul className="space-y-2 text-xs text-structure-secondary">
                <li>User asks questions about documents</li>
                <li>Answers may or may not cite sources</li>
                <li>No control framework mapping</li>
                <li>No conflict detection between documents</li>
                <li>No missing evidence identification</li>
                <li>No structured follow-up checklist</li>
                <li>Results depend on model quality</li>
              </ul>
            </div>
            <div className="p-5">
              <div className="font-sans text-2xs text-status-covered uppercase tracking-wider mb-3">
                Beacon Analyst Desk
              </div>
              <ul className="space-y-2 text-xs text-structure-secondary">
                <li>Structured diligence review with control map</li>
                <li>Every finding cites evidence or marks it missing</li>
                <li>Controls mapped to SOC2, ISO27001, GDPR frameworks</li>
                <li>Explicit conflict detection between documents</li>
                <li>Missing evidence explicitly flagged</li>
                <li>Follow-up checklist grouped by owner and priority</li>
                <li>Deterministic results with eval harness validation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deterministic evaluation */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Deterministic Evaluation
        </h2>
        <p className="text-sm text-structure-secondary leading-relaxed mb-4">
          Beacon includes a deterministic eval harness that validates the synthetic
          dataset across 7 categories: citation coverage, control status correctness,
          missing evidence detection, conflict detection, checklist relevance,
          no-legal-advice language, and synthetic disclosure. All 85 tests pass.
        </p>
        <div className="font-sans text-2xs text-structure-muted">
          These results validate deterministic behaviours in a synthetic demo.
          Beacon does not provide legal, security, or compliance advice.
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Limitations
        </h2>
        <div className="border border-status-partial/30 bg-status-partial/5 p-4 md:p-5">
          <ul className="space-y-2 text-sm text-structure-secondary">
            {[
              "Not legal advice. Not a compliance certification tool.",
              "Uses synthetic data only. No real company data is represented.",
              "No live model calls. All analysis is deterministic.",
              "No real SOC 2, ISO 27001, GDPR, or HIPAA certification claims.",
              "Designed for portfolio demonstration, not production use.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="font-sans text-xs text-status-partial mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-rule pt-8">
        <h2 className="text-lg font-medium text-structure mb-4">
          Explore the Demo
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/room"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-structure text-surface-elevated font-sans text-xs font-medium uppercase tracking-wider hover:bg-structure-secondary transition-colors"
          >
            Enter Diligence Room
          </Link>
          <Link
            href="/memo"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-structure text-structure font-sans text-xs font-medium uppercase tracking-wider hover:bg-structure hover:text-surface-elevated transition-colors"
          >
            Read the Memo
          </Link>
          <Link
            href="/evals"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-structure text-structure font-sans text-xs font-medium uppercase tracking-wider hover:bg-structure hover:text-surface-elevated transition-colors"
          >
            View Evals
          </Link>
        </div>
      </section>
    </div>
  );
}
