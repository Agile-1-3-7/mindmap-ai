export type MisconceptionId = "M01" | "M02" | "M03" | "M04" | "M05";

export type MisconceptionStatus = "possible" | "confirmed" | "improving" | "resolved";

export type ConceptMastery = "Strong" | "Developing" | "Needs attention";

export type ConceptStatus = "not_started" | "misconception" | "improving" | "mastered";

export interface Misconception {
  id: MisconceptionId;
  name: string;
  description: string;
  concept: string;
  explanation: {
    quick: string;
    detailed: string;
    basics: string;
  };
  relationshipFlow: {
    stage1: string;
    stage2: string;
    stage3: string;
    stage4: string;
  };
  keyDistinction: {
    termA: string;
    descriptionA: string;
    termB: string;
    descriptionB: string;
  };
  analogy: string;
  example: string;
  reassessmentQuestion: {
    prompt: string;
    context: string;
    correctAnswerExplanation: string;
    suggestedCorrectAnswer: string;
    suggestedWrongAnswer: string;
  };
}

export type InterventionType = "explanation" | "analogy" | "comparison" | "example";

export interface MisconceptionCandidate {
  id: MisconceptionId;
  confidence: number;
}

export interface DiagnosticEvaluation {
  correctness: "correct" | "partially_correct" | "incorrect";
  conceptUnderstanding: string;
  missingConcept: string | null;
  misconceptionCandidates: MisconceptionCandidate[];
  evidenceSummary: string;
  suggestFollowUpQuestionId?: string | null;
  isSimulated?: boolean;
}

export interface AnalysisResult {
  isCorrect: boolean;
  correctness: "correct" | "partially_correct" | "incorrect";
  misconceptionId: MisconceptionId | null;
  confidence: number;
  evidenceSummary: string;
  interventionType?: InterventionType;
  isSimulated?: boolean;
}

export interface StudentMisconceptionRecord {
  id: MisconceptionId;
  name: string;
  concept: string;
  status: MisconceptionStatus;
  confidence: number;
  evidenceCount: number;
  firstDetected: string;
  lastTested: string;
  interventionCount: number;
  lastReassessmentResult: "correct" | "incorrect" | null;
  history: Array<{
    timestamp: string;
    questionPrompt: string;
    studentAnswer: string;
    evaluation: string;
    isCorrect: boolean;
  }>;
}

export interface Question {
  id: string;
  topicId: string;
  concept: string;
  title: string;
  prompt: string;
  context?: string;
  hints?: string[];
  expectedConcept: string;
  isDisambiguationQuestion?: boolean;
  disambiguationPair?: [MisconceptionId, MisconceptionId];
  suggestedAnswers: {
    label: string;
    answer: string;
    triggersMisconception?: MisconceptionId;
    isCorrect?: boolean;
  }[];
}

export interface StudentAttempt {
  id: string;
  questionId: string;
  questionPrompt: string;
  studentAnswer: string;
  timestamp: string;
  isCorrect: boolean;
  correctness: "correct" | "partially_correct" | "incorrect";
  misconceptionId: MisconceptionId | null;
  confidence: number;
  evidenceSummary: string;
  interventionType?: InterventionType;
  isReassessment?: boolean;
}

export interface ConceptNode {
  id: string;
  name: string;
  category: string;
  mastery: ConceptMastery;
  status: ConceptStatus;
  misconceptionId?: MisconceptionId | null;
  activeMisconceptionId?: MisconceptionId | null;
  description: string;
  attemptsCount: number;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "active" | "coming_soon";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  conceptsCount: number;
  iconName: string;
}

export interface MockTestQuestion {
  id: string;
  concept: string;
  question: string;
  type: "multiple_choice" | "free_response";
  options?: string[];
  correctOptionIndex?: number;
  correctExplanation: string;
  testsMisconceptionId?: MisconceptionId;
  isTransfer?: boolean;
}

export interface MockTest {
  id: string;
  title: string;
  generatedAt: string;
  rationale: string;
  blueprint: Array<{
    topic: string;
    count: number;
    purpose: string;
  }>;
  questions: MockTestQuestion[];
  score?: number;
  totalQuestions: number;
  completed: boolean;
  conceptualProfile?: Record<string, ConceptMastery>;
  diagnosticFinding?: string;
}
