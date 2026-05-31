// Beacon — Diligence & Compliance Analyst
// Domain types for NovaPay AI synthetic diligence review

// ============================================================================
// Document Types
// ============================================================================

export type DocumentCategory =
  | "policy"
  | "contract"
  | "security"
  | "hr"
  | "financial"
  | "technical";

export type DocumentStatus = "current" | "expired" | "missing" | "draft";

export interface DocumentSection {
  id: string;
  documentId: string;
  title: string;
  order: number;
  evidenceIds: string[];
}

export interface DiligenceDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedAt: string;
  lastUpdated: string;
  content: string;
  metadata: Record<string, string>;
  sectionCount: number;
  controlDomains: string[];
  riskRelevance: RiskLevel;
  reviewed: boolean;
}

// ============================================================================
// Control Types
// ============================================================================

export type ControlFramework = "SOC2" | "ISO27001" | "GDPR" | "HIPAA" | "CUSTOM";

export type ControlStatus =
  | "covered"
  | "partial"
  | "missing"
  | "conflict"
  | "not_applicable";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Control {
  id: string;
  framework: ControlFramework;
  controlId: string;
  title: string;
  description: string;
  status: ControlStatus;
  evidenceIds: string[];
  riskLevel: RiskLevel;
  lastReviewed: string;
  notes?: string;
}

// ============================================================================
// Evidence Types
// ============================================================================

export type EvidenceConfidence = "high" | "medium" | "low";

export interface Evidence {
  id: string;
  documentId: string;
  controlIds: string[];
  excerpt: string;
  citation: string;
  pageOrSection: string;
  confidence: EvidenceConfidence;
  verifiedAt: string;
}

// ============================================================================
// Finding Types
// ============================================================================

export type FindingSeverity = "info" | "low" | "medium" | "high" | "critical";

export type FindingCategory =
  | "gap"
  | "risk"
  | "conflict"
  | "observation"
  | "recommendation";

export type FindingStatus = "open" | "acknowledged" | "resolved" | "accepted";

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  evidenceIds: string[];
  controlIds: string[];
  recommendation: string;
  status: FindingStatus;
}

// ============================================================================
// Checklist Types
// ============================================================================

export type ChecklistPriority = "must_have" | "should_have" | "nice_to_have";

export type ChecklistStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "deferred";

export type ChecklistOwner = "Legal" | "Security" | "CTO/Product";

export interface ChecklistItem {
  id: string;
  findingIds: string[];
  controlIds: string[];
  question: string;
  priority: ChecklistPriority;
  owner: ChecklistOwner;
  reason: string;
  triggeredBy: string;
  assignedTo?: string;
  status: ChecklistStatus;
  dueDate?: string;
  notes?: string;
}

// ============================================================================
// Memo Types
// ============================================================================

export interface MemoSection {
  id: string;
  title: string;
  content: string;
  findingIds: string[];
  order: number;
}

export interface DiligenceMemo {
  id: string;
  subject: string;
  generatedAt: string;
  executiveSummary: string;
  sections: MemoSection[];
  conclusion: string;
  disclaimers: string[];
}

// ============================================================================
// Eval Types
// ============================================================================

export interface EvalMetrics {
  citationAccuracy: number;
  controlCoverage: number;
  riskClassification: number;
}

export interface EvalCase {
  id: string;
  category: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  metrics: EvalMetrics;
}

// ============================================================================
// App State Types
// ============================================================================

export type ViewMode = "overview" | "detail";

export interface AppState {
  documents: DiligenceDocument[];
  controls: Control[];
  evidence: Evidence[];
  findings: Finding[];
  checklist: ChecklistItem[];
  memo: DiligenceMemo | null;
  evals: EvalCase[];
  selectedDocumentId: string | null;
  selectedControlId: string | null;
  viewMode: ViewMode;
}
