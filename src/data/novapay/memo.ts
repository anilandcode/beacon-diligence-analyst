import type { DiligenceMemo } from "@/lib/domain/types";

export const memo: DiligenceMemo = {
  id: "memo-001",
  subject: "Enterprise Readiness Review — NovaPay AI",
  generatedAt: "2026-05-31",
  executiveSummary:
    "NovaPay AI submitted a synthetic diligence room containing 18 documents for enterprise readiness review. The review identified 9 findings across 16 assessed controls: 3 critical, 4 high, 1 medium, and 1 low severity. The most significant risk is a direct conflict between the AI Data-Use Policy and the Master Services Agreement regarding customer data usage for model training. Two critical gaps — missing business continuity documentation and an expired SOC 2 report — must also be resolved. NovaPay AI is not recommended for enterprise approval in its current state.",
  sections: [
    {
      id: "memo-s1",
      title: "Scope and Methodology",
      content:
        "This review assessed 18 documents provided by NovaPay AI against SOC 2, ISO 27001, GDPR, and custom diligence controls covering data privacy and AI governance. Evidence was extracted from each document and mapped to the relevant control framework requirements. Each finding is supported by cited evidence or explicitly marked as missing where no documentation was provided.",
      findingIds: [],
      order: 1,
    },
    {
      id: "memo-s2",
      title: "Overall Posture",
      content:
        "Of 16 assessed controls, 6 are covered, 4 are partially covered, 3 are missing, and 3 contain conflicting evidence. The security fundamentals — access controls, vulnerability management, and authentication — are reasonably well-documented [ev-001][ev-009][ev-010]. However, governance-level controls around change management, business continuity, and AI data use present significant gaps.",
      findingIds: ["finding-001", "finding-006"],
      order: 2,
    },
    {
      id: "memo-s3",
      title: "Flagship Risk: AI Data-Use Conflict",
      content:
        "The most significant risk identified is a direct contradiction between two governing documents. The AI Data-Use Policy (§3.1) states: 'Customer content is not used to train shared models' [ev-011]. The Master Services Agreement (§7.4) states: 'Service data may be used to improve platform performance' [ev-012]. The term 'service data' in the MSA is not clearly distinguished from 'customer content' in the AI policy. This creates material ambiguity about whether customer data is used for model training, fine-tuning, or platform optimization. This conflict must be resolved before any enterprise deployment involving sensitive data.",
      findingIds: ["finding-003"],
      order: 3,
    },
    {
      id: "memo-s4",
      title: "Material Gaps",
      content:
        "Two critical documentation gaps were identified. First, no business continuity plan or disaster recovery documentation was found in the diligence room — controls A1.1 and A1.2 are classified as missing with critical risk [finding-002]. Second, the SOC 2 Type II report expired in March 2024 with no renewal or bridge letter provided, leaving a 12-month gap in independent assurance [ev-002]. The SOC 2 report also identified a significant deficiency in change management with no formal Change Advisory Board [finding-006].",
      findingIds: ["finding-001", "finding-002", "finding-006"],
      order: 4,
    },
    {
      id: "memo-s5",
      title: "Data Governance Conflicts",
      content:
        "In addition to the AI data-use conflict, a secondary data governance conflict was identified. The Data Processing Agreement specifies a 36-month retention period [ev-003], while the Privacy Policy states 24 months [ev-004]. These documents are both customer-facing and the contradiction creates GDPR compliance risk. The Data Retention Schedule aligns with the DPA's 36-month term, suggesting the Privacy Policy may be outdated.",
      findingIds: ["finding-004"],
      order: 5,
    },
    {
      id: "memo-s6",
      title: "Vendor and Insurance Risks",
      content:
        "The Vendor Security Assessment remains in draft with only 3 of 8 sub-processors formally assessed [finding-007]. The cyber liability insurance certificate expired in January 2025 with no renewal evidence [finding-005]. Both items represent gaps in third-party risk management and financial risk transfer.",
      findingIds: ["finding-005", "finding-007"],
      order: 6,
    },
    {
      id: "memo-s7",
      title: "Follow-Up Requirements",
      content:
        "Ten follow-up items have been issued, grouped by owner. Legal must reconcile the AI data-use conflict and the retention period discrepancy. Security must provide updated SOC 2, insurance, and vendor assessment documentation. CTO/Product must provide BCP/DR plans and change management evidence. Four items are classified as must-have prerequisites for enterprise approval.",
      findingIds: [],
      order: 7,
    },
  ],
  conclusion:
    "Based on the current state of the diligence room, NovaPay AI is not ready for enterprise approval. The AI data-use conflict between the policy and MSA presents the most significant contractual risk. The missing business continuity documentation, expired SOC 2 report, and expired insurance certificate are material gaps. A follow-up review should be scheduled after NovaPay AI resolves the must-have items on the pre-approval checklist.",
  disclaimers: [
    "This memo is generated from synthetic data for a fictional company (NovaPay AI) as part of a portfolio demonstration.",
    "This does not constitute legal advice, compliance certification, or a real diligence opinion.",
    "No real company data, compliance certifications, or audit results are represented.",
    "All findings are based on synthetic documents created for illustration purposes only.",
    "Beacon is not a compliance certification tool. No SOC 2, ISO 27001, GDPR, or HIPAA certification claims are made.",
  ],
};
