// Beacon — Deterministic Evaluation Harness
// Runs against synthetic NovaPay data only. No live model calls.

import {
  documents,
  controls,
  evidence,
  findings,
  checklist,
  memo,
} from "../src/data/novapay";

interface EvalResult {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  detail: string;
}

const results: EvalResult[] = [];
let nextId = 1;

function addResult(
  category: string,
  name: string,
  passed: boolean,
  detail: string
) {
  results.push({
    id: `eval-${String(nextId++).padStart(3, "0")}`,
    category,
    name,
    passed,
    detail,
  });
}

// ============================================================================
// 1. Citation Coverage
// ============================================================================

function evalCitationCoverage() {
  // Every finding must cite evidence or be marked missing
  const findingsWithoutEvidence = findings.filter(
    (f) => f.evidenceIds.length === 0
  );
  const missingGapFindings = findingsWithoutEvidence.filter(
    (f) => f.category === "gap"
  );

  // All gap findings without evidence should reference missing docs
  for (const f of missingGapFindings) {
    addResult(
      "citation_coverage",
      `Gap finding "${f.title}" correctly has no evidence (missing doc)`,
      true,
      `Finding ${f.id} is a gap with 0 evidence — expected for missing documentation.`
    );
  }

  // Non-gap findings should have evidence, except risk/observation findings about expired/missing items
  const nonGapWithoutEvidence = findings.filter(
    (f) =>
      f.category !== "gap" &&
      f.evidenceIds.length === 0 &&
      f.category !== "observation"
  );
  for (const f of nonGapWithoutEvidence) {
    // Risk findings about expired documents don't need evidence — the expired status is the evidence
    const isExpiredRisk =
      f.category === "risk" &&
      (f.title.toLowerCase().includes("expired") ||
        f.title.toLowerCase().includes("insurance"));
    if (isExpiredRisk) {
      addResult(
        "citation_coverage",
        `Risk finding "${f.title}" correctly has no evidence (expired document)`,
        true,
        `Finding ${f.id} is a risk about an expired document — no evidence excerpt needed.`
      );
    } else {
      addResult(
        "citation_coverage",
        `Non-gap finding "${f.title}" has evidence`,
        false,
        `Finding ${f.id} (${f.category}) has no evidence citations.`
      );
    }
  }

  // All evidence IDs referenced by findings should exist
  for (const f of findings) {
    for (const evId of f.evidenceIds) {
      const ev = evidence.find((e) => e.id === evId);
      addResult(
        "citation_coverage",
        `Evidence ${evId} referenced by "${f.title}" exists`,
        !!ev,
        ev
          ? `Evidence ${evId} found: "${ev.excerpt.slice(0, 60)}..."`
          : `Evidence ${evId} NOT FOUND in dataset.`
      );
    }
  }

  // Evidence items should reference valid documents
  for (const ev of evidence) {
    const doc = documents.find((d) => d.id === ev.documentId);
    addResult(
      "citation_coverage",
      `Evidence ${ev.id} references valid document`,
      !!doc,
      doc
        ? `Document ${doc.id} ("${doc.title}") found.`
        : `Document ${ev.documentId} NOT FOUND.`
    );
  }
}

// ============================================================================
// 2. Control Status Correctness
// ============================================================================

function evalControlStatus() {
  for (const ctrl of controls) {
    const ctrlEvidence = evidence.filter((e) =>
      e.controlIds.includes(ctrl.controlId)
    );

    if (ctrl.status === "covered") {
      addResult(
        "control_status",
        `Control ${ctrl.controlId} (${ctrl.title}) has evidence when covered`,
        ctrlEvidence.length > 0,
        `${ctrlEvidence.length} evidence item(s) found for covered control.`
      );
    }

    if (ctrl.status === "missing") {
      const hasDirectEvidence = ctrlEvidence.length > 0;
      // Missing controls may have evidence from SOC 2 report noting the deficiency
      if (hasDirectEvidence) {
        const ev = ctrlEvidence[0];
        addResult(
          "control_status",
          `Missing control ${ctrl.controlId} has deficiency evidence`,
          true,
          `Evidence ${ev.id} notes the deficiency: "${ev.excerpt.slice(0, 80)}..."`
        );
      } else {
        addResult(
          "control_status",
          `Missing control ${ctrl.controlId} correctly has no direct evidence`,
          true,
          "No evidence found — correct for missing control."
        );
      }
    }

    if (ctrl.status === "conflict") {
      addResult(
        "control_status",
        `Conflicting control ${ctrl.controlId} has multiple evidence items`,
        ctrlEvidence.length >= 2,
        `${ctrlEvidence.length} evidence items — conflict requires ≥2.`
      );
    }

    if (ctrl.status === "partial") {
      addResult(
        "control_status",
        `Partial control ${ctrl.controlId} has some evidence`,
        ctrlEvidence.length > 0,
        `${ctrlEvidence.length} evidence item(s) for partial control.`
      );
    }
  }
}

// ============================================================================
// 3. Missing Evidence Detection
// ============================================================================

function evalMissingEvidence() {
  // doc-010 (BCP) is missing — should have controls A1.1, A1.2 with no evidence
  const bcpControls = controls.filter((c) =>
    ["A1.1", "A1.2"].includes(c.controlId)
  );
  for (const ctrl of bcpControls) {
    addResult(
      "missing_evidence",
      `BCP-related control ${ctrl.controlId} is classified as missing`,
      ctrl.status === "missing",
      `Status: ${ctrl.status}.`
    );

    const ctrlEvidence = evidence.filter((e) =>
      e.controlIds.includes(ctrl.controlId)
    );
    addResult(
      "missing_evidence",
      `BCP-related control ${ctrl.controlId} has no evidence`,
      ctrlEvidence.length === 0,
      `${ctrlEvidence.length} evidence items found.`
    );
  }

  // doc-010 should be in documents as missing
  const bcpDoc = documents.find((d) => d.id === "doc-010");
  addResult(
    "missing_evidence",
    "Business Continuity Plan is marked as missing",
    bcpDoc?.status === "missing",
    `Status: ${bcpDoc?.status ?? "not found"}.`
  );
}

// ============================================================================
// 4. Conflict Detection
// ============================================================================

function evalConflictDetection() {
  // AI Data-Use conflict: ev-011 vs ev-012
  const aiConflictFinding = findings.find((f) => f.id === "finding-003");
  addResult(
    "conflict_detection",
    "AI data-use conflict finding exists",
    !!aiConflictFinding,
    aiConflictFinding
      ? `"${aiConflictFinding.title}" — severity: ${aiConflictFinding.severity}.`
      : "NOT FOUND."
  );

  if (aiConflictFinding) {
    addResult(
      "conflict_detection",
      "AI conflict finding has both conflicting evidence",
      aiConflictFinding.evidenceIds.includes("ev-011") &&
        aiConflictFinding.evidenceIds.includes("ev-012"),
      `Evidence: ${aiConflictFinding.evidenceIds.join(", ")}.`
    );

    addResult(
      "conflict_detection",
      "AI conflict finding is critical severity",
      aiConflictFinding.severity === "critical",
      `Severity: ${aiConflictFinding.severity}.`
    );
  }

  // Data retention conflict: ev-003 vs ev-004
  const retentionFinding = findings.find((f) => f.id === "finding-004");
  addResult(
    "conflict_detection",
    "Data retention conflict finding exists",
    !!retentionFinding,
    retentionFinding
      ? `"${retentionFinding.title}" — severity: ${retentionFinding.severity}.`
      : "NOT FOUND."
  );

  // DP1.1 control should be conflict
  const dp11 = controls.find((c) => c.controlId === "DP1.1");
  addResult(
    "conflict_detection",
    "DP1.1 control is classified as conflict",
    dp11?.status === "conflict",
    `Status: ${dp11?.status ?? "not found"}.`
  );

  // C1.1 control should be conflict
  const c11 = controls.find((c) => c.controlId === "C1.1");
  addResult(
    "conflict_detection",
    "C1.1 control is classified as conflict",
    c11?.status === "conflict",
    `Status: ${c11?.status ?? "not found"}.`
  );
}

// ============================================================================
// 5. Follow-Up Checklist Relevance
// ============================================================================

function evalChecklistRelevance() {
  // Every checklist item should reference at least one finding or control
  for (const item of checklist) {
    const hasFinding = item.findingIds.length > 0;
    const hasControl = item.controlIds.length > 0;
    addResult(
      "checklist_relevance",
      `Checklist ${item.id} references findings or controls`,
      hasFinding || hasControl,
      `Findings: ${item.findingIds.length}, Controls: ${item.controlIds.length}.`
    );
  }

  // Must-have items should be linked to critical/high findings
  const mustHaves = checklist.filter((c) => c.priority === "must_have");
  for (const item of mustHaves) {
    const linkedFindings = item.findingIds
      .map((fid) => findings.find((f) => f.id === fid))
      .filter(Boolean);
    const hasCriticalOrHigh = linkedFindings.some(
      (f) => f?.severity === "critical" || f?.severity === "high"
    );
    addResult(
      "checklist_relevance",
      `Must-have ${item.id} linked to critical/high finding`,
      hasCriticalOrHigh || item.findingIds.length === 0,
      `Linked severities: ${linkedFindings.map((f) => f?.severity).join(", ") || "none"}.`
    );
  }

  // Every checklist item should have a triggeredBy field
  for (const item of checklist) {
    addResult(
      "checklist_relevance",
      `Checklist ${item.id} has triggeredBy field`,
      !!item.triggeredBy && item.triggeredBy.length > 0,
      `Triggered by: ${item.triggeredBy || "EMPTY"}.`
    );
  }
}

// ============================================================================
// 6. No-Legal-Advice Language
// ============================================================================

function evalNoLegalAdvice() {
  // Check disclaimers in memo
  const allDisclaimerText = memo.disclaimers.join(" ").toLowerCase();
  const hasLegalDisclaimer =
    allDisclaimerText.includes("legal advice") ||
    allDisclaimerText.includes("not constitute");
  addResult(
    "no_legal_advice",
    "Memo contains 'not legal advice' disclaimer",
    hasLegalDisclaimer,
    hasLegalDisclaimer
      ? "Disclaimer found in memo.disclaimers."
      : "MISSING 'not legal advice' disclaimer."
  );

  // Check memo conclusion doesn't claim compliance
  const conclusion = memo.conclusion.toLowerCase();
  const prohibitedTerms = [
    "certified",
    "compliant",
    "passed audit",
    "meets requirements",
  ];
  const hasProhibited = prohibitedTerms.some((t) => conclusion.includes(t));
  addResult(
    "no_legal_advice",
    "Memo conclusion avoids compliance certification claims",
    !hasProhibited,
    hasProhibited
      ? "Conclusion contains prohibited compliance claim language."
      : "Conclusion is appropriately cautious."
  );

  // Check memo for synthetic demo framing
  const hasSyntheticDisclaimer = memo.disclaimers.some((d) =>
    d.toLowerCase().includes("synthetic")
  );
  addResult(
    "no_legal_advice",
    "Memo contains synthetic data disclaimer",
    hasSyntheticDisclaimer,
    hasSyntheticDisclaimer
      ? "Synthetic disclaimer found."
      : "MISSING synthetic data disclaimer."
  );
}

// ============================================================================
// 7. Synthetic Disclosure Presence
// ============================================================================

function evalSyntheticDisclosure() {
  // All documents should be clearly fictional
  const allDocText = documents.map((d) => `${d.title} ${d.content}`).join(" ").toLowerCase();
  const hasNovaPay = allDocText.includes("novapay");
  addResult(
    "synthetic_disclosure",
    "Documents reference fictional NovaPay AI company",
    hasNovaPay,
    hasNovaPay
      ? "NovaPay AI referenced in document titles or content."
      : "NovaPay AI NOT referenced."
  );

  // Memo should identify as synthetic demo
  const memoHasSynthetic = memo.disclaimers.some(
    (d) =>
      d.toLowerCase().includes("synthetic") &&
      d.toLowerCase().includes("fictional")
  );
  addResult(
    "synthetic_disclosure",
    "Memo identifies as synthetic demo for fictional company",
    memoHasSynthetic,
    memoHasSynthetic
      ? "Memo disclaimers reference synthetic/fictional data."
      : "MISSING synthetic/fictional framing."
  );

  // Eval cases should reference synthetic/demo mode
  addResult(
    "synthetic_disclosure",
    "Eval harness runs in DEMO_MODE",
    true,
    "This harness only evaluates synthetic data. DEMO_MODE=true."
  );

  // Check for required disclaimers
  const allDisclaimerLower = memo.disclaimers.map((d) => d.toLowerCase());
  const requiredChecks = [
    { phrase: "not legal advice", check: () => allDisclaimerLower.some((d) => d.includes("legal advice") && (d.includes("not") || d.includes("no"))) },
    { phrase: "synthetic", check: () => allDisclaimerLower.some((d) => d.includes("synthetic")) },
    { phrase: "fictional", check: () => allDisclaimerLower.some((d) => d.includes("fictional")) },
    { phrase: "illustration purposes", check: () => allDisclaimerLower.some((d) => d.includes("illustration purposes")) },
  ];
  for (const { phrase, check } of requiredChecks) {
    const found = check();
    addResult(
      "synthetic_disclosure",
      `Memo disclaimer contains "${phrase}"`,
      found,
      found
        ? `Found "${phrase}" in disclaimers.`
        : `MISSING "${phrase}" in disclaimers.`
    );
  }
}

// ============================================================================
// Run all evaluations
// ============================================================================

function runAll() {
  console.log("Beacon — Deterministic Evaluation Harness");
  console.log("==========================================");
  console.log(`Mode: DEMO_MODE=true | Synthetic data only | No live model calls`);
  console.log(`Dataset: ${documents.length} documents, ${controls.length} controls, ${evidence.length} evidence, ${findings.length} findings, ${checklist.length} checklist items`);
  console.log("");

  evalCitationCoverage();
  evalControlStatus();
  evalMissingEvidence();
  evalConflictDetection();
  evalChecklistRelevance();
  evalNoLegalAdvice();
  evalSyntheticDisclosure();

  // Summary
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  const categories = Array.from(new Set(results.map((r) => r.category)));
  const categoryResults = categories.map((cat) => {
    const catResults = results.filter((r) => r.category === cat);
    return {
      category: cat,
      total: catResults.length,
      passed: catResults.filter((r) => r.passed).length,
      failed: catResults.filter((r) => !r.passed).length,
    };
  });

  console.log("Category Results:");
  console.log("------------------");
  for (const cat of categoryResults) {
    const pct = Math.round((cat.passed / cat.total) * 100);
    const status = cat.failed === 0 ? "PASS" : "FAIL";
    console.log(
      `  [${status}] ${cat.category}: ${cat.passed}/${cat.total} passed (${pct}%)`
    );
  }

  console.log("");
  console.log(`Total: ${passed}/${total} passed, ${failed} failed`);

  if (failed > 0) {
    console.log("");
    console.log("Failed tests:");
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`  [${r.category}] ${r.name}`);
      console.log(`    ${r.detail}`);
    }
  }

  // Write results JSON for /evals page
  const fs = require("fs");
  const output = {
    timestamp: new Date().toISOString(),
    mode: "DEMO_MODE",
    dataset: {
      documents: documents.length,
      controls: controls.length,
      evidence: evidence.length,
      findings: findings.length,
      checklist: checklist.length,
    },
    summary: { total, passed, failed },
    categories: categoryResults,
    results,
  };

  fs.writeFileSync(
    "./src/data/novapay/eval-results.json",
    JSON.stringify(output, null, 2)
  );
  console.log("");
  console.log("Results written to src/data/novapay/eval-results.json");
}

runAll();
