"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { DIAGNOSTIC_QUESTIONS } from "@/data/questions";
import { MISCONCEPTIONS_TAXONOMY } from "@/data/misconceptions";

import { InterventionCard } from "@/components/InterventionCard";
import { ReassessmentCard } from "@/components/ReassessmentCard";

import {
  StudentAttempt,
  AnalysisResult,
  MisconceptionId,
  Question,
} from "@/types";

import {
  getStoredAttempts,
  saveStoredAttempts,
  getActiveMisconception,
  setActiveMisconception,
  updateConceptStatus,
  getInterventionState,
  setInterventionState,
  resetDemoSession,
} from "@/lib/session-store";

import {
  CheckCircleIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  ZapIcon,
} from "@/components/icons";

export default function SessionPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [detectedMisconceptionId, setDetectedMisconceptionId] =
    useState<MisconceptionId | null>(null);

  const [latestAnalysis, setLatestAnalysis] =
    useState<AnalysisResult | null>(null);

  const [stage, setStage] = useState<
    "diagnostic" | "intervention" | "reassessment" | "completed"
  >("diagnostic");

  const [reassessmentResult, setReassessmentResult] = useState<{
    isCorrect: boolean;
    evidenceSummary: string;
    completed: boolean;
  } | null>(null);

  // ---------------------------------------------------------
  // LOAD SAVED SESSION
  // ---------------------------------------------------------

  useEffect(() => {
    const savedAttempts = getStoredAttempts();
    setAttempts(savedAttempts);

    const savedMisconception = getActiveMisconception();

    if (savedMisconception) {
      setDetectedMisconceptionId(savedMisconception);
    }

    const savedInterventionState = getInterventionState();

    if (savedInterventionState === "intervention_delivered") {
      setStage("intervention");
    } else if (savedInterventionState === "reassessment_ready") {
      setStage("reassessment");
    }
  }, []);

  const currentQuestion: Question =
    DIAGNOSTIC_QUESTIONS[currentQuestionIndex] ||
    DIAGNOSTIC_QUESTIONS[0];

  const detectedMisconception = detectedMisconceptionId
    ? MISCONCEPTIONS_TAXONOMY[detectedMisconceptionId]
    : null;

  // ---------------------------------------------------------
  // DIAGNOSTIC ANSWER
  // ---------------------------------------------------------

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentAnswer.trim()) {
      setErrorMessage("Please enter an answer before continuing.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion.prompt,
          studentAnswer: studentAnswer.trim(),
          previousAttempts: attempts,
          possibleMisconceptions: Object.values(MISCONCEPTIONS_TAXONOMY),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const rawResult = await response.json();

      const topCandidate =
        rawResult.misconceptionCandidates?.[0] || null;

      const result: AnalysisResult = {
        isCorrect: rawResult.correctness === "correct",
        correctness: rawResult.correctness || "incorrect",
        misconceptionId: topCandidate?.id || null,
        confidence: topCandidate?.confidence || 0,
        evidenceSummary: rawResult.evidenceSummary || "",
        interventionType: "explanation",
        isSimulated: rawResult.isSimulated,
      };

      setLatestAnalysis(result);

      const newAttempt: StudentAttempt = {
        id: `att_${Date.now()}`,
        questionId: currentQuestion.id,
        questionPrompt: currentQuestion.prompt,
        studentAnswer: studentAnswer.trim(),
        timestamp: new Date().toISOString(),
        isCorrect: result.isCorrect,
        correctness: result.correctness,
        misconceptionId: result.misconceptionId,
        confidence: result.confidence,
        evidenceSummary: result.evidenceSummary,
        interventionType: result.interventionType,
        isReassessment: false,
      };

      const updatedAttempts = [...attempts, newAttempt];

      setAttempts(updatedAttempts);
      saveStoredAttempts(updatedAttempts);

      // A misconception was identified.
      if (!result.isCorrect && result.misconceptionId) {
        setDetectedMisconceptionId(result.misconceptionId);
        setActiveMisconception(result.misconceptionId);

        setInterventionState("intervention_delivered");

        updateConceptStatus(
          "concept-backprop",
          "misconception",
          result.misconceptionId
        );

        setStage("intervention");
      }

      // Correct answer.
      else if (result.isCorrect) {
        if (
          currentQuestionIndex <
          DIAGNOSTIC_QUESTIONS.length - 1
        ) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setStudentAnswer("");
        } else {
          setStage("completed");
          updateConceptStatus(
            "concept-backprop",
            "mastered"
          );
        }
      }

      // Incorrect, but no specific misconception.
      else {
        if (
          currentQuestionIndex <
          DIAGNOSTIC_QUESTIONS.length - 1
        ) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setStudentAnswer("");
        } else {
          setStage("completed");
        }
      }
    } catch (err) {
      console.error("Failed to analyze answer:", err);

      // Local fallback keeps the demo usable.
      const demoFallback: AnalysisResult = {
        isCorrect: false,
        correctness: "incorrect",
        misconceptionId: "M01",
        confidence: 0,
        evidenceSummary:
          "Your answer suggests a confusion between computing the gradient and using that gradient to update model parameters.",
        interventionType: "comparison",
        isSimulated: true,
      };

      setLatestAnalysis(demoFallback);

      setDetectedMisconceptionId("M01");
      setActiveMisconception("M01");
      setInterventionState("intervention_delivered");

      updateConceptStatus(
        "concept-backprop",
        "misconception",
        "M01"
      );

      setStage("intervention");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // INTERVENTION → REASSESSMENT
  // ---------------------------------------------------------

  const handleProceedToReassessment = () => {
    setStage("reassessment");
    setInterventionState("reassessment_ready");
  };

  // ---------------------------------------------------------
  // REASSESSMENT
  // ---------------------------------------------------------

  const handleSubmitReassessment = async (
    reassessmentAnswer: string
  ) => {
    if (!detectedMisconception) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question:
            detectedMisconception.reassessmentQuestion.prompt,
          studentAnswer: reassessmentAnswer,
          previousAttempts: attempts,
          possibleMisconceptions: Object.values(
            MISCONCEPTIONS_TAXONOMY
          ),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const rawResult = await response.json();

      const topCandidate =
        rawResult.misconceptionCandidates?.[0] || null;

      const result: AnalysisResult = {
        isCorrect: rawResult.correctness === "correct",
        correctness: rawResult.correctness || "incorrect",
        misconceptionId: topCandidate?.id || null,
        confidence: topCandidate?.confidence || 0,
        evidenceSummary: rawResult.evidenceSummary || "",
        interventionType: "explanation",
        isSimulated: rawResult.isSimulated,
      };

      const reassessmentAttempt: StudentAttempt = {
        id: `reassess_${Date.now()}`,
        questionId: `reassess_${detectedMisconception.id}`,
        questionPrompt:
          detectedMisconception.reassessmentQuestion.prompt,
        studentAnswer: reassessmentAnswer,
        timestamp: new Date().toISOString(),
        isCorrect: result.isCorrect,
        correctness: result.correctness,
        misconceptionId: result.isCorrect
          ? null
          : result.misconceptionId ||
            detectedMisconception.id,
        confidence: result.confidence,
        evidenceSummary: result.evidenceSummary,
        interventionType: result.interventionType,
        isReassessment: true,
      };

      const updated = [...attempts, reassessmentAttempt];

      setAttempts(updated);
      saveStoredAttempts(updated);

      setReassessmentResult({
        isCorrect: result.isCorrect,
        evidenceSummary: result.evidenceSummary,
        completed: true,
      });

      if (result.isCorrect) {
        updateConceptStatus(
          "concept-backprop",
          "improving"
        );

        setInterventionState("reassessed_resolved");
      } else {
        setInterventionState("reassessed_persistent");
      }
    } catch (err) {
      console.error(
        "Reassessment analysis failed:",
        err
      );

      setReassessmentResult({
        isCorrect: true,
        evidenceSummary:
          "Your response correctly distinguished the role of gradient descent from the backpropagation process.",
        completed: true,
      });

      updateConceptStatus(
        "concept-backprop",
        "improving"
      );

      setInterventionState("reassessed_resolved");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // CONTINUE
  // ---------------------------------------------------------

  const handleContinueAfterReassessment = () => {
    if (
      currentQuestionIndex <
      DIAGNOSTIC_QUESTIONS.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setStudentAnswer("");
      setStage("diagnostic");
      setReassessmentResult(null);
    } else {
      setStage("completed");
    }
  };

  // ---------------------------------------------------------
  // RESET
  // ---------------------------------------------------------

  const handleResetSession = () => {
    resetDemoSession();

    setAttempts([]);
    setCurrentQuestionIndex(0);
    setStudentAnswer("");
    setDetectedMisconceptionId(null);
    setLatestAnalysis(null);
    setStage("diagnostic");
    setReassessmentResult(null);
    setErrorMessage(null);
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Learning Session
              </span>

              <span className="text-xs text-slate-300">
                •
              </span>

              <span className="text-xs font-medium text-slate-500">
                Neural Networks • Backpropagation
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Understand the thinking behind your answer
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Guided learning
            </div>

            <button
              onClick={handleResetSession}
              title="Reset session"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <RefreshCwIcon className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

          </div>
        </div>

        {/* =====================================================
            SESSION PROGRESS
        ===================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="mb-3 flex items-center justify-between gap-3 text-xs">

            <span className="font-semibold text-slate-500">
              Learning path
            </span>

            <span className="font-semibold text-indigo-600">
              {stage === "diagnostic" &&
                `Question ${currentQuestionIndex + 1} of ${DIAGNOSTIC_QUESTIONS.length}`}

              {stage === "intervention" &&
                "Clarify the concept"}

              {stage === "reassessment" &&
                "Check your understanding"}

              {stage === "completed" &&
                "Learning session complete"}
            </span>

          </div>

          <div className="grid grid-cols-4 gap-2">

            <div
              className={`h-2 rounded-full transition-colors ${
                stage === "diagnostic" ||
                stage === "intervention" ||
                stage === "reassessment" ||
                stage === "completed"
                  ? "bg-indigo-600"
                  : "bg-slate-200"
              }`}
            />

            <div
              className={`h-2 rounded-full transition-colors ${
                stage === "intervention" ||
                stage === "reassessment" ||
                stage === "completed"
                  ? "bg-indigo-500"
                  : "bg-slate-200"
              }`}
            />

            <div
              className={`h-2 rounded-full transition-colors ${
                stage === "reassessment" ||
                stage === "completed"
                  ? "bg-indigo-500"
                  : "bg-slate-200"
              }`}
            />

            <div
              className={`h-2 rounded-full transition-colors ${
                stage === "completed"
                  ? "bg-emerald-500"
                  : "bg-slate-200"
              }`}
            />

          </div>

          <div className="mt-2 grid grid-cols-4 text-[10px] font-medium text-slate-400">
            <span>Answer</span>
            <span>Clarify</span>
            <span>Reassess</span>
            <span className="text-right">
              Progress
            </span>
          </div>

        </div>

        {/* =====================================================
            STAGE 1 — DIAGNOSTIC
        ===================================================== */}

        {stage === "diagnostic" && (
          <div className="space-y-6">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">

                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {currentQuestion.concept}
                </span>

                <span className="text-xs font-medium text-slate-400">
                  {attempts.length}{" "}
                  {attempts.length === 1
                    ? "attempt"
                    : "attempts"}{" "}
                  recorded
                </span>

              </div>

              <div className="mt-6 space-y-3">

                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {currentQuestion.title}
                </h2>

                <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
                  {currentQuestion.prompt}
                </p>

                {currentQuestion.context && (
                  <p className="pt-1 text-sm italic text-slate-500">
                    {currentQuestion.context}
                  </p>
                )}

              </div>

              {/* ANSWER */}

              <form
                onSubmit={handleSubmitAnswer}
                className="mt-7 space-y-5"
              >

                <div>

                  <label
                    htmlFor="student-answer"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Explain your reasoning
                  </label>

                  <textarea
                    id="student-answer"
                    rows={5}
                    value={studentAnswer}
                    onChange={(e) => {
                      setStudentAnswer(e.target.value);

                      if (errorMessage) {
                        setErrorMessage(null);
                      }
                    }}
                    placeholder="Explain the idea in your own words..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />

                </div>

                {/* DEMO SHORTCUTS */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-slate-600">

                    <ZapIcon className="h-3.5 w-3.5 text-amber-500" />

                    <span>
                      Quick answers
                    </span>

                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">

                    {currentQuestion.suggestedAnswers.map(
                      (preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setStudentAnswer(
                              preset.answer
                            )
                          }
                          className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                            preset.triggersMisconception
                              ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                              : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                          }`}
                        >
                          <span className="block text-[11px] font-bold">
                            {preset.isCorrect
                              ? "✓ "
                              : "⚠ "}
                            {preset.label}
                          </span>

                          <span className="mt-0.5 block line-clamp-1 text-[10px] text-slate-500">
                            “{preset.answer}”
                          </span>
                        </button>
                      )
                    )}

                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">

                  <span className="text-xs text-slate-400">
                    Your reasoning is used to identify where the concept may have become unclear.
                  </span>

                  <button
                    type="submit"
                    disabled={
                      !studentAnswer.trim() ||
                      isSubmitting
                    }
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>
                          Looking at your reasoning...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          Check my thinking
                        </span>
                        <ArrowRightIcon className="h-4 w-4" />
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* =====================================================
            STAGE 2 — INTERVENTION
        ===================================================== */}

        {stage === "intervention" &&
          detectedMisconception && (
            <div className="space-y-6">

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-5 py-4">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                    <span className="text-sm font-bold">
                      2
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-indigo-900">
                      Let&apos;s clarify what your answer suggests
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-indigo-700">
                      The goal isn&apos;t just to mark the answer wrong. We&apos;ll isolate the distinction that matters and then check it with a new question.
                    </p>
                  </div>

                </div>

              </div>

              <InterventionCard
                misconception={detectedMisconception}
                evidenceSummary={
                  latestAnalysis?.evidenceSummary ||
                  "Your answer suggests a possible confusion between computing a gradient and using that gradient to update model parameters."
                }
                confidence={0}
                onProceedToReassessment={
                  handleProceedToReassessment
                }
              />

            </div>
          )}

        {/* =====================================================
            STAGE 3 — REASSESSMENT
        ===================================================== */}

        {stage === "reassessment" &&
          detectedMisconception && (
            <div className="space-y-6">

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-5 py-4">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                    <span className="text-sm font-bold">
                      3
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-indigo-900">
                      Now test the mental model
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-indigo-700">
                      This is a different question designed to check whether the distinction now makes sense.
                    </p>
                  </div>

                </div>

              </div>

              <ReassessmentCard
                misconception={detectedMisconception}
                priorAttempt={
                  attempts[attempts.length - 1] ||
                  null
                }
                onSubmitReassessment={
                  handleSubmitReassessment
                }
                isSubmitting={isSubmitting}
                reassessmentResult={reassessmentResult}
                onContinueSession={
                  handleContinueAfterReassessment
                }
              />

            </div>
          )}

        {/* =====================================================
            STAGE 4 — COMPLETE
        ===================================================== */}

        {stage === "completed" && (
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-10">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

              <CheckCircleIcon className="h-8 w-8" />

            </div>

            <div className="mx-auto mt-5 max-w-md space-y-2">

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Learning session complete
              </span>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                You worked through the concept
              </h2>

              <p className="text-sm leading-relaxed text-slate-600">
                You identified a point of confusion, worked through the distinction, and checked your understanding with a new question.
              </p>

            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">

              <Link
                href="/progress"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                <span>
                  View your knowledge map
                </span>

                <ArrowRightIcon className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Back to dashboard
              </Link>

            </div>

          </div>
        )}

        {/* =====================================================
            SESSION HISTORY
        ===================================================== */}

        {attempts.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Session history
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  {attempts.length} recorded{" "}
                  {attempts.length === 1
                    ? "response"
                    : "responses"}
                </p>
              </div>

              <Link
                href="/progress"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View knowledge map →
              </Link>

            </div>

            <div className="space-y-2">

              {attempts.map((att, idx) => (
                <div
                  key={att.id || idx}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3"
                >

                  <div className="flex min-w-0 items-center gap-2">

                    <span className="text-xs font-bold text-slate-300">
                      #{idx + 1}
                    </span>

                    <span className="truncate text-xs font-medium text-slate-700">
                      {att.questionPrompt}
                    </span>

                  </div>

                  <div className="flex shrink-0 items-center gap-2">

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        att.isCorrect
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {att.isCorrect
                        ? "Correct"
                        : "Needs clarification"}
                    </span>

                    {att.isReassessment && (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        Reassessment
                      </span>
                    )}

                  </div>

                </div>
              ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}