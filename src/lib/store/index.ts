// Beacon — Zustand store

import { create } from "zustand";
import type {
  DiligenceDocument,
  Control,
  Evidence,
  Finding,
  ChecklistItem,
  DiligenceMemo,
  EvalCase,
  ViewMode,
} from "@/lib/domain/types";

interface BeaconStore {
  // Data
  documents: DiligenceDocument[];
  controls: Control[];
  evidence: Evidence[];
  findings: Finding[];
  checklist: ChecklistItem[];
  memo: DiligenceMemo | null;
  evals: EvalCase[];

  // UI state
  selectedDocumentId: string | null;
  selectedControlId: string | null;
  viewMode: ViewMode;

  // Actions
  setDocuments: (docs: DiligenceDocument[]) => void;
  setControls: (controls: Control[]) => void;
  setEvidence: (evidence: Evidence[]) => void;
  setFindings: (findings: Finding[]) => void;
  setChecklist: (items: ChecklistItem[]) => void;
  setMemo: (memo: DiligenceMemo) => void;
  setEvals: (evals: EvalCase[]) => void;
  selectDocument: (id: string | null) => void;
  selectControl: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useBeaconStore = create<BeaconStore>((set) => ({
  // Initial data
  documents: [],
  controls: [],
  evidence: [],
  findings: [],
  checklist: [],
  memo: null,
  evals: [],

  // Initial UI state
  selectedDocumentId: null,
  selectedControlId: null,
  viewMode: "overview",

  // Actions
  setDocuments: (documents) => set({ documents }),
  setControls: (controls) => set({ controls }),
  setEvidence: (evidence) => set({ evidence }),
  setFindings: (findings) => set({ findings }),
  setChecklist: (checklist) => set({ checklist }),
  setMemo: (memo) => set({ memo }),
  setEvals: (evals) => set({ evals }),
  selectDocument: (id) => set({ selectedDocumentId: id }),
  selectControl: (id) => set({ selectedControlId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
