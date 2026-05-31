import type { DocumentSection } from "@/lib/domain/types";

export const documentSections: DocumentSection[] = [
  // doc-001: Information Security Policy
  { id: "sec-001-1", documentId: "doc-001", title: "Purpose and Scope", order: 1, evidenceIds: [] },
  { id: "sec-001-2", documentId: "doc-001", title: "Security Framework", order: 2, evidenceIds: [] },
  { id: "sec-001-3", documentId: "doc-001", title: "Roles and Responsibilities", order: 3, evidenceIds: [] },
  { id: "sec-001-4", documentId: "doc-001", title: "Access Controls", order: 4, evidenceIds: ["ev-001"] },
  { id: "sec-001-5", documentId: "doc-001", title: "Incident Management", order: 5, evidenceIds: [] },
  { id: "sec-001-6", documentId: "doc-001", title: "Data Classification", order: 6, evidenceIds: [] },
  { id: "sec-001-7", documentId: "doc-001", title: "Training and Awareness", order: 7, evidenceIds: [] },
  { id: "sec-001-8", documentId: "doc-001", title: "Policy Review", order: 8, evidenceIds: [] },

  // doc-002: Data Processing Agreement
  { id: "sec-002-1", documentId: "doc-002", title: "Parties and Definitions", order: 1, evidenceIds: [] },
  { id: "sec-002-2", documentId: "doc-002", title: "Scope of Processing", order: 2, evidenceIds: [] },
  { id: "sec-002-3", documentId: "doc-002", title: "Data Controller Obligations", order: 3, evidenceIds: [] },
  { id: "sec-002-4", documentId: "doc-002", title: "Data Processor Obligations", order: 4, evidenceIds: [] },
  { id: "sec-002-5", documentId: "doc-002", title: "Data Retention", order: 5, evidenceIds: ["ev-003"] },
  { id: "sec-002-6", documentId: "doc-002", title: "Sub-processors", order: 6, evidenceIds: [] },
  { id: "sec-002-7", documentId: "doc-002", title: "Data Transfers", order: 7, evidenceIds: [] },
  { id: "sec-002-8", documentId: "doc-002", title: "Breach Notification", order: 8, evidenceIds: [] },
  { id: "sec-002-9", documentId: "doc-002", title: "Audit Rights", order: 9, evidenceIds: [] },
  { id: "sec-002-10", documentId: "doc-002", title: "Liability", order: 10, evidenceIds: [] },
  { id: "sec-002-11", documentId: "doc-002", title: "Term and Termination", order: 11, evidenceIds: [] },
  { id: "sec-002-12", documentId: "doc-002", title: "Governing Law", order: 12, evidenceIds: [] },

  // doc-003: SOC 2 Type II Report
  { id: "sec-003-1", documentId: "doc-003", title: "Report Summary", order: 1, evidenceIds: [] },
  { id: "sec-003-2", documentId: "doc-003", title: "System Description", order: 2, evidenceIds: [] },
  { id: "sec-003-3", documentId: "doc-003", title: "Control Environment", order: 3, evidenceIds: ["ev-002"] },
  { id: "sec-003-4", documentId: "doc-003", title: "Risk Assessment", order: 4, evidenceIds: ["ev-008"] },
  { id: "sec-003-5", documentId: "doc-003", title: "Control Activities", order: 5, evidenceIds: [] },
  { id: "sec-003-6", documentId: "doc-003", title: "Exceptions and Qualifications", order: 6, evidenceIds: [] },

  // doc-004: Privacy Policy
  { id: "sec-004-1", documentId: "doc-004", title: "Information We Collect", order: 1, evidenceIds: [] },
  { id: "sec-004-2", documentId: "doc-004", title: "How We Use Information", order: 2, evidenceIds: [] },
  { id: "sec-004-3", documentId: "doc-004", title: "Data Sharing", order: 3, evidenceIds: [] },
  { id: "sec-004-4", documentId: "doc-004", title: "Data Retention", order: 4, evidenceIds: ["ev-004"] },
  { id: "sec-004-5", documentId: "doc-004", title: "Your Rights", order: 5, evidenceIds: [] },
  { id: "sec-004-6", documentId: "doc-004", title: "International Transfers", order: 6, evidenceIds: [] },
  { id: "sec-004-7", documentId: "doc-004", title: "Security", order: 7, evidenceIds: [] },
  { id: "sec-004-8", documentId: "doc-004", title: "Children's Privacy", order: 8, evidenceIds: [] },
  { id: "sec-004-9", documentId: "doc-004", title: "Contact Us", order: 9, evidenceIds: [] },

  // doc-007: Incident Response Plan
  { id: "sec-007-1", documentId: "doc-007", title: "Purpose and Scope", order: 1, evidenceIds: [] },
  { id: "sec-007-2", documentId: "doc-007", title: "Detection and Classification", order: 2, evidenceIds: ["ev-005"] },
  { id: "sec-007-3", documentId: "doc-007", title: "Escalation Procedures", order: 3, evidenceIds: [] },
  { id: "sec-007-4", documentId: "doc-007", title: "Containment", order: 4, evidenceIds: [] },
  { id: "sec-007-5", documentId: "doc-007", title: "Eradication and Recovery", order: 5, evidenceIds: [] },
  { id: "sec-007-6", documentId: "doc-007", title: "Post-Incident Review", order: 6, evidenceIds: [] },
  { id: "sec-007-7", documentId: "doc-007", title: "Communication Plan", order: 7, evidenceIds: [] },

  // doc-008: Master Services Agreement
  { id: "sec-008-1", documentId: "doc-008", title: "Definitions", order: 1, evidenceIds: [] },
  { id: "sec-008-2", documentId: "doc-008", title: "Service Description", order: 2, evidenceIds: [] },
  { id: "sec-008-3", documentId: "doc-008", title: "Fees and Payment", order: 3, evidenceIds: [] },
  { id: "sec-008-4", documentId: "doc-008", title: "Term and Termination", order: 4, evidenceIds: [] },
  { id: "sec-008-5", documentId: "doc-008", title: "Intellectual Property", order: 5, evidenceIds: [] },
  { id: "sec-008-6", documentId: "doc-008", title: "Confidentiality", order: 6, evidenceIds: [] },
  { id: "sec-008-7", documentId: "doc-008", title: "Data Usage Rights", order: 7, evidenceIds: ["ev-012"] },
  { id: "sec-008-8", documentId: "doc-008", title: "Warranties", order: 8, evidenceIds: [] },
  { id: "sec-008-9", documentId: "doc-008", title: "Limitation of Liability", order: 9, evidenceIds: [] },
  { id: "sec-008-10", documentId: "doc-008", title: "Indemnification", order: 10, evidenceIds: [] },
  { id: "sec-008-11", documentId: "doc-008", title: "Insurance", order: 11, evidenceIds: [] },
  { id: "sec-008-12", documentId: "doc-008", title: "SLA", order: 12, evidenceIds: [] },
  { id: "sec-008-13", documentId: "doc-008", title: "Dispute Resolution", order: 13, evidenceIds: [] },
  { id: "sec-008-14", documentId: "doc-008", title: "Force Majeure", order: 14, evidenceIds: [] },
  { id: "sec-008-15", documentId: "doc-008", title: "General Provisions", order: 15, evidenceIds: [] },

  // doc-009: API Security Documentation
  { id: "sec-009-1", documentId: "doc-009", title: "Overview", order: 1, evidenceIds: [] },
  { id: "sec-009-2", documentId: "doc-009", title: "Authentication Mechanisms", order: 2, evidenceIds: ["ev-009"] },
  { id: "sec-009-3", documentId: "doc-009", title: "Authorization and Access Control", order: 3, evidenceIds: ["ev-007"] },
  { id: "sec-009-4", documentId: "doc-009", title: "Rate Limiting", order: 4, evidenceIds: [] },
  { id: "sec-009-5", documentId: "doc-009", title: "Encryption", order: 5, evidenceIds: [] },
  { id: "sec-009-6", documentId: "doc-009", title: "Logging and Monitoring", order: 6, evidenceIds: [] },

  // doc-011: Penetration Test Results
  { id: "sec-011-1", documentId: "doc-011", title: "Executive Summary", order: 1, evidenceIds: ["ev-006"] },
  { id: "sec-011-2", documentId: "doc-011", title: "Scope and Methodology", order: 2, evidenceIds: [] },
  { id: "sec-011-3", documentId: "doc-011", title: "Findings", order: 3, evidenceIds: [] },
  { id: "sec-011-4", documentId: "doc-011", title: "Remediation Status", order: 4, evidenceIds: [] },
  { id: "sec-011-5", documentId: "doc-011", title: "Recommendations", order: 5, evidenceIds: [] },

  // doc-016: AI Data-Use Policy
  { id: "sec-016-1", documentId: "doc-016", title: "Purpose", order: 1, evidenceIds: [] },
  { id: "sec-016-2", documentId: "doc-016", title: "Scope", order: 2, evidenceIds: [] },
  { id: "sec-016-3", documentId: "doc-016", title: "Model Training Restrictions", order: 3, evidenceIds: ["ev-011"] },
  { id: "sec-016-4", documentId: "doc-016", title: "Data Processing Boundaries", order: 4, evidenceIds: [] },
  { id: "sec-016-5", documentId: "doc-016", title: "Transparency Requirements", order: 5, evidenceIds: [] },

  // doc-018: Access Control Matrix
  { id: "sec-018-1", documentId: "doc-018", title: "Role Definitions", order: 1, evidenceIds: [] },
  { id: "sec-018-2", documentId: "doc-018", title: "System Access Matrix", order: 2, evidenceIds: ["ev-010"] },
  { id: "sec-018-3", documentId: "doc-018", title: "Privileged Access Register", order: 3, evidenceIds: [] },
];
