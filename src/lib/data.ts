// Beacon — Data accessor helpers

import {
  documents,
  documentSections,
  controls,
  evidence,
  findings,
  checklist,
  memo,
  evals,
} from "@/data/novapay";
import type {
  DiligenceDocument,
  DocumentSection,
  Control,
  Evidence,
  Finding,
  ChecklistItem,
  ChecklistOwner,
} from "@/lib/domain/types";

// ============================================================================
// Document accessors
// ============================================================================

export function getDocument(id: string): DiligenceDocument | undefined {
  return documents.find((d) => d.id === id);
}

export function getDocumentsByCategory(
  category: DiligenceDocument["category"]
): DiligenceDocument[] {
  return documents.filter((d) => d.category === category);
}

export function getDocumentsByStatus(
  status: DiligenceDocument["status"]
): DiligenceDocument[] {
  return documents.filter((d) => d.status === status);
}

export function getSectionsForDocument(documentId: string): DocumentSection[] {
  return documentSections.filter((s) => s.documentId === documentId).sort((a, b) => a.order - b.order);
}

export function getChecklistForFinding(findingId: string): ChecklistItem[] {
  return checklist.filter((c) => c.findingIds.includes(findingId));
}

// ============================================================================
// Control accessors
// ============================================================================

export function getControl(id: string): Control | undefined {
  return controls.find((c) => c.id === id);
}

export function getControlByCode(controlId: string): Control | undefined {
  return controls.find((c) => c.controlId === controlId);
}

export function getControlsByFramework(framework: Control["framework"]): Control[] {
  return controls.filter((c) => c.framework === framework);
}

export function getControlsByStatus(status: Control["status"]): Control[] {
  return controls.filter((c) => c.status === status);
}

// ============================================================================
// Evidence accessors
// ============================================================================

export function getEvidence(id: string): Evidence | undefined {
  return evidence.find((e) => e.id === id);
}

export function getEvidenceForControl(controlId: string): Evidence[] {
  return evidence.filter((e) => e.controlIds.includes(controlId));
}

export function getEvidenceForDocument(documentId: string): Evidence[] {
  return evidence.filter((e) => e.documentId === documentId);
}

export function getEvidenceByIds(ids: string[]): Evidence[] {
  return evidence.filter((e) => ids.includes(e.id));
}

// ============================================================================
// Finding accessors
// ============================================================================

export function getFinding(id: string): Finding | undefined {
  return findings.find((f) => f.id === id);
}

export function getFindingsByCategory(category: Finding["category"]): Finding[] {
  return findings.filter((f) => f.category === category);
}

export function getFindingsBySeverity(severity: Finding["severity"]): Finding[] {
  return findings.filter((f) => f.severity === severity);
}

export function getFindingsForControl(controlId: string): Finding[] {
  return findings.filter((f) => f.controlIds.includes(controlId));
}

// ============================================================================
// Checklist accessors
// ============================================================================

export function getChecklistByOwner(owner: ChecklistOwner): ChecklistItem[] {
  return checklist.filter((c) => c.owner === owner);
}

export function getChecklistByPriority(
  priority: ChecklistItem["priority"]
): ChecklistItem[] {
  return checklist.filter((c) => c.priority === priority);
}

// ============================================================================
// Aggregate accessors
// ============================================================================

export function getControlSummary() {
  const total = controls.length;
  const covered = controls.filter((c) => c.status === "covered").length;
  const partial = controls.filter((c) => c.status === "partial").length;
  const missing = controls.filter((c) => c.status === "missing").length;
  const conflict = controls.filter((c) => c.status === "conflict").length;
  const notApplicable = controls.filter(
    (c) => c.status === "not_applicable"
  ).length;

  return { total, covered, partial, missing, conflict, notApplicable };
}

export function getRiskSummary() {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const medium = findings.filter((f) => f.severity === "medium").length;
  const low = findings.filter((f) => f.severity === "low").length;

  return { critical, high, medium, low };
}

export function getDocumentSummary() {
  const total = documents.length;
  const current = documents.filter((d) => d.status === "current").length;
  const expired = documents.filter((d) => d.status === "expired").length;
  const missing = documents.filter((d) => d.status === "missing").length;
  const draft = documents.filter((d) => d.status === "draft").length;

  return { total, current, expired, missing, draft };
}

export function getFollowUpCounts() {
  const mustHave = checklist.filter((c) => c.priority === "must_have").length;
  const shouldHave = checklist.filter((c) => c.priority === "should_have").length;
  const niceToHave = checklist.filter((c) => c.priority === "nice_to_have").length;

  return { mustHave, shouldHave, niceToHave };
}

// Re-export data for convenience
export { documents, documentSections, controls, evidence, findings, checklist, memo, evals };
