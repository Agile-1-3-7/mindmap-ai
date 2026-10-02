"use client";

import {
  StudentAttempt,
  MisconceptionId,
  ConceptNode,
  ConceptMastery,
  ConceptStatus,
  StudentMisconceptionRecord,
  MockTest,
} from "@/types";
import { INITIAL_CONCEPT_NODES } from "@/data/topics";
import { MISCONCEPTIONS_TAXONOMY } from "@/data/misconceptions";
import { INITIAL_MOCK_TEST } from "@/data/mock-tests";

const STORAGE_KEY_ATTEMPTS = "mindmap_attempts_v2";
const STORAGE_KEY_CONCEPTS = "mindmap_concepts_v2";
const STORAGE_KEY_MISCONCEPTIONS = "mindmap_misconceptions_v2";
const STORAGE_KEY_ACTIVE_MISCONCEPTION = "mindmap_active_misconception_v2";
const STORAGE_KEY_STATUS = "mindmap_intervention_status_v2";
const STORAGE_KEY_MOCK_TEST = "mindmap_mock_test_v2";

export type InterventionState =
  | "none"
  | "detected"
  | "intervention_delivered"
  | "reassessment_ready"
  | "reassessed_resolved"
  | "reassessed_persistent";

export const INITIAL_STUDENT_MISCONCEPTIONS: Record<MisconceptionId, StudentMisconceptionRecord> = {
  M01: {
    id: "M01",
    name: "Backpropagation is the same as gradient descent",
    concept: "Backpropagation vs. Gradient Descent",
    status: "confirmed",
    confidence: 0.92,
    evidenceCount: 3,
    firstDetected: "Yesterday",
    lastTested: "Today",
    interventionCount: 1,
    lastReassessmentResult: null,
    history: [
      {
        timestamp: "Yesterday, 3:14 PM",
        questionPrompt: "What is the primary role of backpropagation in training a neural network?",
        studentAnswer: "It updates the weights of the network to minimize loss.",
        evaluation: "Conflated the backward derivative propagation pass with parameter optimization.",
        isCorrect: false
      },
      {
        timestamp: "Yesterday, 3:20 PM",
        questionPrompt: "If we replace SGD with Adam, does backpropagation change?",
        studentAnswer: "Yes, because Adam changes how backprop adjusts the weights.",
        evaluation: "Continued belief that backpropagation mutates weights directly.",
        isCorrect: false
      },
      {
        timestamp: "Today, 10:02 AM",
        questionPrompt: "What immediate values are produced at the end of the backward pass?",
        studentAnswer: "The new updated weights for the next forward pass.",
        evaluation: "Third consistent instance attributing weight updates to backpropagation.",
        isCorrect: false
      }
    ]
  },
  M02: {
    id: "M02",
    name: "Backpropagation directly updates the weights",
    concept: "Weight Mutation vs Gradient Accumulation",
    status: "possible",
    confidence: 0.65,
    evidenceCount: 1,
    firstDetected: "Today",
    lastTested: "Today",
    interventionCount: 0,
    lastReassessmentResult: null,
    history: [
      {
        timestamp: "Today, 10:15 AM",
        questionPrompt: "Explain what happens when loss.backward() executes in code.",
        studentAnswer: "It computes error and modifies the weights inside the layer tensor.",
        evaluation: "Single instance indicating confusion between grad accumulation and weight tensor mutation.",
        isCorrect: false
      }
    ]
  },
  M03: {
    id: "M03",
    name: "Gradients and weights are the same thing",
    concept: "Model Parameters vs Parameter Gradients",
    status: "resolved",
    confidence: 0.12,
    evidenceCount: 1,
    firstDetected: "3 days ago",
    lastTested: "Yesterday",
    interventionCount: 1,
    lastReassessmentResult: "correct",
    history: []
  },
  M04: {
    id: "M04",
    name: "Loss and gradient are the same thing",
    concept: "Scalar Loss vs Vector Gradients",
    status: "resolved",
    confidence: 0.08,
    evidenceCount: 1,
    firstDetected: "4 days ago",
    lastTested: "2 days ago",
    interventionCount: 1,
    lastReassessmentResult: "correct",
    history: []
  },
  M05: {
    id: "M05",
    name: "Activation derivatives do not affect backpropagation",
    concept: "Chain Rule & Activation Derivatives",
    status: "possible",
    confidence: 0.55,
    evidenceCount: 1,
    firstDetected: "2 days ago",
    lastTested: "2 days ago",
    interventionCount: 0,
    lastReassessmentResult: null,
    history: []
  }
};

export const getStoredAttempts = (): StudentAttempt[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredAttempts = (attempts: StudentAttempt[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts));
  } catch (e) {
    console.error("Failed to store attempts in localStorage", e);
  }
};

export const getStoredConcepts = (): ConceptNode[] => {
  if (typeof window === "undefined") return INITIAL_CONCEPT_NODES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONCEPTS);
    return raw ? JSON.parse(raw) : INITIAL_CONCEPT_NODES;
  } catch {
    return INITIAL_CONCEPT_NODES;
  }
};

export const saveStoredConcepts = (concepts: ConceptNode[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CONCEPTS, JSON.stringify(concepts));
  } catch (e) {
    console.error("Failed to store concepts in localStorage", e);
  }
};

export const updateConceptMastery = (
  conceptId: string,
  newMastery: ConceptMastery,
  activeMisconceptionId?: MisconceptionId | null
) => {
  const masteryToStatus: Record<ConceptMastery, ConceptStatus> = {
    "Strong": "mastered",
    "Developing": "improving",
    "Needs attention": "misconception",
  };
  const current = getStoredConcepts();
  const updated = current.map((node) => {
    if (node.id === conceptId) {
      return {
        ...node,
        mastery: newMastery,
        status: masteryToStatus[newMastery],
        misconceptionId:
          newMastery === "Strong"
            ? null
            : activeMisconceptionId !== undefined
            ? activeMisconceptionId
            : node.misconceptionId,
        activeMisconceptionId:
          newMastery === "Strong"
            ? null
            : activeMisconceptionId !== undefined
            ? activeMisconceptionId
            : node.activeMisconceptionId,
      };
    }
    return node;
  });
  saveStoredConcepts(updated);
  return updated;
};

/**
 * Update concept status using ConceptStatus vocabulary (used by session page).
 * Maps: "misconception" -> "Needs attention", "improving" -> "Developing", "mastered" -> "Strong"
 */
export const updateConceptStatus = (
  conceptId: string,
  newStatus: ConceptStatus,
  misconceptionId?: MisconceptionId | null
) => {
  const statusToMastery: Record<ConceptStatus, ConceptMastery> = {
    "not_started": "Needs attention",
    "misconception": "Needs attention",
    "improving": "Developing",
    "mastered": "Strong",
  };
  return updateConceptMastery(conceptId, statusToMastery[newStatus], misconceptionId);
};

export const getStoredMisconceptionRecords = (): Record<MisconceptionId, StudentMisconceptionRecord> => {
  if (typeof window === "undefined") return INITIAL_STUDENT_MISCONCEPTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MISCONCEPTIONS);
    return raw ? JSON.parse(raw) : INITIAL_STUDENT_MISCONCEPTIONS;
  } catch {
    return INITIAL_STUDENT_MISCONCEPTIONS;
  }
};

export const saveStoredMisconceptionRecords = (
  records: Record<MisconceptionId, StudentMisconceptionRecord>
) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MISCONCEPTIONS, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to store misconception records in localStorage", e);
  }
};

export const recordMisconceptionEvidence = (
  mId: MisconceptionId,
  questionPrompt: string,
  studentAnswer: string,
  evaluation: string,
  isCorrect: boolean
) => {
  const allRecords = getStoredMisconceptionRecords();
  const record = allRecords[mId] || {
    id: mId,
    name: MISCONCEPTIONS_TAXONOMY[mId]?.name || mId,
    concept: MISCONCEPTIONS_TAXONOMY[mId]?.concept || "Neural Networks",
    status: "possible" as const,
    confidence: 0.5,
    evidenceCount: 0,
    firstDetected: "Today",
    lastTested: "Today",
    interventionCount: 0,
    lastReassessmentResult: null,
    history: []
  };

  const newHistoryItem = {
    timestamp: "Just now",
    questionPrompt,
    studentAnswer,
    evaluation,
    isCorrect
  };

  if (!isCorrect) {
    record.evidenceCount += 1;
    record.lastTested = "Today";
    // Multiple consistent mistakes -> confirmed
    if (record.evidenceCount >= 3) {
      record.status = "confirmed";
      record.confidence = Math.min(0.96, record.confidence + 0.12);
    } else {
      record.status = "possible";
      record.confidence = Math.min(0.85, record.confidence + 0.15);
    }
  } else {
    // Correct answer / resolved evidence
    record.lastTested = "Today";
    record.lastReassessmentResult = "correct";
    if (record.status === "confirmed") {
      record.status = "improving";
      record.confidence = Math.max(0.4, record.confidence - 0.3);
    } else if (record.status === "improving" || record.status === "possible") {
      record.status = "resolved";
      record.confidence = Math.max(0.1, record.confidence - 0.4);
    }
  }

  record.history = [newHistoryItem, ...(record.history || [])];
  allRecords[mId] = record;
  saveStoredMisconceptionRecords(allRecords);

  // Synchronize concept node
  if (record.status === "improving") {
    updateConceptMastery("concept-backprop", "Developing", mId);
  } else if (record.status === "resolved") {
    updateConceptMastery("concept-backprop", "Strong", null);
  } else if (record.status === "confirmed" || record.status === "possible") {
    updateConceptMastery("concept-backprop", "Needs attention", mId);
  }

  return record;
};

export const getActiveMisconception = (): MisconceptionId | null => {
  if (typeof window === "undefined") return "M01";
  try {
    return (localStorage.getItem(STORAGE_KEY_ACTIVE_MISCONCEPTION) as MisconceptionId) || "M01";
  } catch {
    return "M01";
  }
};

export const setActiveMisconception = (mId: MisconceptionId | null) => {
  if (typeof window === "undefined") return;
  try {
    if (mId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_MISCONCEPTION, mId);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_MISCONCEPTION);
    }
  } catch (e) {
    console.error("Failed to save active misconception", e);
  }
};

export const getInterventionState = (): InterventionState => {
  if (typeof window === "undefined") return "none";
  try {
    return (localStorage.getItem(STORAGE_KEY_STATUS) as InterventionState) || "none";
  } catch {
    return "none";
  }
};

export const setInterventionState = (state: InterventionState) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_STATUS, state);
  } catch (e) {
    console.error("Failed to set intervention state", e);
  }
};

export const getStoredMockTest = (): MockTest => {
  if (typeof window === "undefined") return INITIAL_MOCK_TEST;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MOCK_TEST);
    return raw ? JSON.parse(raw) : INITIAL_MOCK_TEST;
  } catch {
    return INITIAL_MOCK_TEST;
  }
};

export const saveStoredMockTest = (mockTest: MockTest) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MOCK_TEST, JSON.stringify(mockTest));
  } catch (e) {
    console.error("Failed to store mock test", e);
  }
};

export const resetDemoSession = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_MISCONCEPTION);
    localStorage.removeItem(STORAGE_KEY_STATUS);
    localStorage.removeItem(STORAGE_KEY_MOCK_TEST);
    localStorage.setItem(STORAGE_KEY_CONCEPTS, JSON.stringify(INITIAL_CONCEPT_NODES));
    localStorage.setItem(STORAGE_KEY_MISCONCEPTIONS, JSON.stringify(INITIAL_STUDENT_MISCONCEPTIONS));
  } catch (e) {
    console.error("Failed to reset session", e);
  }
};
