// Beacon — Zod validation schemas

import { z } from "zod";

// ============================================================================
// Shared Enums (defined first for reuse)
// ============================================================================

export const RiskLevelSchema = z.enum([
  "low",
  "medium",
  "high",
  "critical",
]);

// ============================================================================
// Document Schemas
// ============================================================================

export const DocumentCategorySchema = z.enum([
  "policy",
  "contract",
  "security",
  "hr",
  "financial",
  "technical",
]);

export const DocumentStatusSchema = z.enum([
  "current",
  "expired",
  "missing",
  "draft",
]);

export const DiligenceDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: DocumentCategorySchema,
  status: DocumentStatusSchema,
  uploadedAt: z.string(),
  lastUpdated: z.string(),
  content: z.string(),
  metadata: z.record(z.string(), z.string()),
  sectionCount: z.number(),
  controlDomains: z.array(z.string()),
  riskRelevance: RiskLevelSchema,
  reviewed: z.boolean(),
});

// ============================================================================
// Control Schemas
// ============================================================================

export const ControlFrameworkSchema = z.enum([
  "SOC2",
  "ISO27001",
  "GDPR",
  "HIPAA",
  "CUSTOM",
]);

export const ControlStatusSchema = z.enum([
  "covered",
  "partial",
  "missing",
  "conflict",
  "not_applicable",
]);

export const ControlSchema = z.object({
  id: z.string(),
  framework: ControlFrameworkSchema,
  controlId: z.string(),
  title: z.string(),
  description: z.string(),
  status: ControlStatusSchema,
  evidenceIds: z.array(z.string()),
  riskLevel: RiskLevelSchema,
  lastReviewed: z.string(),
  notes: z.string().optional(),
});

// ============================================================================
// Evidence Schemas
// ============================================================================

export const EvidenceConfidenceSchema = z.enum(["high", "medium", "low"]);

export const EvidenceSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  controlIds: z.array(z.string()),
  excerpt: z.string(),
  citation: z.string(),
  pageOrSection: z.string(),
  confidence: EvidenceConfidenceSchema,
  verifiedAt: z.string(),
});

// ============================================================================
// Finding Schemas
// ============================================================================

export const FindingSeveritySchema = z.enum([
  "info",
  "low",
  "medium",
  "high",
  "critical",
]);

export const FindingCategorySchema = z.enum([
  "gap",
  "risk",
  "conflict",
  "observation",
  "recommendation",
]);

export const FindingStatusSchema = z.enum([
  "open",
  "acknowledged",
  "resolved",
  "accepted",
]);

export const FindingSchema = z.object({
  id: z.string(),
  category: FindingCategorySchema,
  severity: FindingSeveritySchema,
  title: z.string(),
  description: z.string(),
  evidenceIds: z.array(z.string()),
  controlIds: z.array(z.string()),
  recommendation: z.string(),
  status: FindingStatusSchema,
});

// ============================================================================
// Checklist Schemas
// ============================================================================

export const ChecklistPrioritySchema = z.enum([
  "must_have",
  "should_have",
  "nice_to_have",
]);

export const ChecklistStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "deferred",
]);

export const ChecklistOwnerSchema = z.enum(["Legal", "Security", "CTO/Product"]);

export const ChecklistItemSchema = z.object({
  id: z.string(),
  findingIds: z.array(z.string()),
  controlIds: z.array(z.string()),
  question: z.string(),
  priority: ChecklistPrioritySchema,
  owner: ChecklistOwnerSchema,
  reason: z.string(),
  triggeredBy: z.string(),
  assignedTo: z.string().optional(),
  status: ChecklistStatusSchema,
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// Memo Schemas
// ============================================================================

export const MemoSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  findingIds: z.array(z.string()),
  order: z.number(),
});

export const DiligenceMemoSchema = z.object({
  id: z.string(),
  subject: z.string(),
  generatedAt: z.string(),
  executiveSummary: z.string(),
  sections: z.array(MemoSectionSchema),
  conclusion: z.string(),
  disclaimers: z.array(z.string()),
});

// ============================================================================
// Eval Schemas
// ============================================================================

export const EvalMetricsSchema = z.object({
  citationAccuracy: z.number().min(0).max(1),
  controlCoverage: z.number().min(0).max(1),
  riskClassification: z.number().min(0).max(1),
});

export const EvalCaseSchema = z.object({
  id: z.string(),
  category: z.string(),
  input: z.string(),
  expectedOutput: z.string(),
  actualOutput: z.string().optional(),
  passed: z.boolean().optional(),
  metrics: EvalMetricsSchema,
});
