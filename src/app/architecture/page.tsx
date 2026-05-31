export default function ArchitecturePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider mb-2">
          Architecture
        </div>
        <h1 className="text-2xl font-medium text-structure mb-2">
          Technical Architecture
        </h1>
        <p className="text-sm text-structure-secondary">
          How Beacon works as a deterministic, zero-cost diligence analysis demo.
        </p>
      </div>

      {/* Stack */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { layer: "Web App", tech: "Next.js 14 App Router + TypeScript", status: "implemented" },
            { layer: "UI", tech: "Tailwind CSS + custom component primitives", status: "implemented" },
            { layer: "Validation", tech: "Zod schemas for all domain types", status: "implemented" },
            { layer: "State", tech: "Zustand store for app state", status: "implemented" },
            { layer: "Data", tech: "Synthetic JSON fixtures — no database", status: "deterministic" },
            { layer: "Search", tech: "Local deterministic text matching", status: "deterministic" },
            { layer: "Tests", tech: "Vitest + deterministic eval harness", status: "implemented" },
            { layer: "Deployment", tech: "Vercel (standalone)", status: "implemented" },
          ].map((item) => (
            <div key={item.layer} className="p-3 border border-rule bg-surface-elevated">
              <div className="flex items-center justify-between mb-1">
                <div className="font-sans text-2xs text-structure-muted uppercase tracking-wider">
                  {item.layer}
                </div>
                <span className={`font-sans text-2xs ${
                  item.status === "implemented"
                    ? "text-status-covered"
                    : "text-status-partial"
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="text-sm text-structure">{item.tech}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Product Modes
        </h2>
        <div className="border border-rule bg-surface-elevated">
          <div className="hidden md:grid grid-cols-4 gap-4 p-4 border-b border-rule bg-surface-sunken font-sans text-2xs text-structure-muted uppercase tracking-wider">
            <div>Mode</div>
            <div className="col-span-2">Description</div>
            <div>Status</div>
          </div>
          {[
            {
              mode: "DEMO_MODE=true",
              desc: "Synthetic seeded workspace, deterministic guided results",
              status: "Active",
              statusStyle: "text-status-covered",
            },
            {
              mode: "RETRIEVAL_MODE=local",
              desc: "Local text matching over synthetic documents",
              status: "Active",
              statusStyle: "text-status-covered",
            },
            {
              mode: "LIVE_AI_MODE=true",
              desc: "Optional protected model-composed analysis layer",
              status: "Future",
              statusStyle: "text-structure-muted",
            },
            {
              mode: "LIVE_CONNECTORS=true",
              desc: "Optional future real document connectors",
              status: "Future",
              statusStyle: "text-structure-muted",
            },
          ].map((item) => (
            <div
              key={item.mode}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 p-4 border-b border-rule last:border-0"
            >
              <div className="font-sans text-xs font-mono text-structure-muted">
                {item.mode}
              </div>
              <div className="md:col-span-2 text-sm text-structure-secondary">
                {item.desc}
              </div>
              <div className={`font-sans text-xs ${item.statusStyle}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data flow */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Data Flow
        </h2>
        <div className="border border-rule bg-surface-elevated p-5">
          <div className="space-y-3 font-sans text-xs text-structure-secondary">
            {[
              { label: "Documents", desc: "18 synthetic NovaPay AI documents (JSON fixtures)" },
              { label: "Sections", desc: "45 document sections with evidence links" },
              { label: "Evidence", desc: "12 evidence excerpts mapped to controls" },
              { label: "Controls", desc: "16 controls across SOC2, ISO27001, GDPR, Custom" },
              { label: "Findings", desc: "9 findings with severity and recommendations" },
              { label: "Checklist", desc: "10 follow-up items grouped by owner" },
              { label: "Memo", desc: "7-section cited diligence memo with disclaimers" },
              { label: "Evals", desc: "85 deterministic tests across 7 categories" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-24 text-right text-structure-muted flex-shrink-0">
                  {item.label}
                </div>
                <div className="flex-shrink-0">→</div>
                <div>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design constraints */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Design Constraints
        </h2>
        <ul className="space-y-2 text-sm text-structure-secondary">
          {[
            "Zero runtime AI cost in public demo mode",
            "Every finding must cite evidence or be marked missing/unsupported",
            "No real compliance certifications or legal advice",
            "No chatbot interface — desk analyst tool only",
            "No database, vector DB, or external services",
            "LIVE_AI_MODE protected and not exposed in public demo",
            "All evals are deterministic and reproducible",
          ].map((constraint) => (
            <li key={constraint} className="flex items-start gap-2">
              <span className="font-sans text-xs text-status-covered mt-0.5">✓</span>
              <span>{constraint}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Environment */}
      <section>
        <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
          Environment Defaults
        </h2>
        <div className="border border-rule bg-surface-sunken p-4 font-mono text-xs text-structure-secondary">
          <div>NEXT_PUBLIC_DEMO_MODE=true</div>
          <div>RETRIEVAL_MODE=local</div>
          <div>LIVE_AI_MODE=false</div>
          <div>AI_PROVIDER=none</div>
        </div>
      </section>
    </div>
  );
}
