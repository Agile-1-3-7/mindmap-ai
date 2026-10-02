import React, { useState } from "react";
import { Misconception, StudentAttempt } from "@/types";
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
} from "./icons";

interface ReassessmentCardProps {
  misconception: Misconception;
  priorAttempt: StudentAttempt | null;
  onSubmitReassessment: (answer: string) => Promise<void>;
  isSubmitting: boolean;
  reassessmentResult: {
    isCorrect: boolean;
    evidenceSummary: string;
    completed: boolean;
  } | null;
  onContinueSession: () => void;
}

export function ReassessmentCard({
  misconception,
  priorAttempt,
  onSubmitReassessment,
  isSubmitting,
  reassessmentResult,
  onContinueSession,
}: ReassessmentCardProps) {
  const [studentAnswer, setStudentAnswer] = useState("");
  const question = misconception.reassessmentQuestion;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentAnswer.trim() || isSubmitting) return;

    onSubmitReassessment(studentAnswer.trim());
  };

  const handlePreset = (text: string) => {
    setStudentAnswer(text);
  };

  const isComplete = reassessmentResult?.completed === true;
  const isCorrect = reassessmentResult?.isCorrect === true;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
          Reassessment
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Let&apos;s see if the idea has clicked
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          This question tests the same concept in a different way.
          Your answer will show whether the original misunderstanding
          has been corrected.
        </p>
      </div>

      <div className="px-6 py-6 sm:px-8">

        {/* Concept being checked */}
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
            ✓
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
              Checking
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-800">
              {misconception.concept}
            </p>
          </div>
        </div>

        {/* Question */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-600">
            New question
          </p>

          <p className="mt-3 text-base font-semibold leading-7 text-slate-900 sm:text-lg">
            {question.prompt}
          </p>
        </div>

        {/* Answer */}
        {!isComplete ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            <div>
              <label
                htmlFor="reassessment-input"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Your explanation
              </label>

              <textarea
                id="reassessment-input"
                rows={5}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Explain your reasoning in your own words..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />

              <p className="mt-2 text-xs text-slate-400">
                There&apos;s no need to use exact terminology. We&apos;re
                interested in how you understand the idea.
              </p>
            </div>

            {/* Demo presets — kept, but visually quiet */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold text-slate-500">
                Quick test
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handlePreset(question.suggestedCorrectAnswer)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  Fill correct answer
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePreset(question.suggestedWrongAnswer)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-700"
                >
                  Fill incorrect answer
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!studentAnswer.trim() || isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Checking your answer...
                  </>
                ) : (
                  <>
                    Check my understanding
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (

          /* Result */
          <div className="mt-6">

            <div
              className={`rounded-xl border p-5 sm:p-6 ${
                isCorrect
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-amber-200 bg-amber-50/60"
              }`}
            >
              <div className="flex items-start gap-4">

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isCorrect
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    <AlertTriangleIcon className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                      isCorrect
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {isCorrect
                      ? "Concept improving"
                      : "Still needs practice"}
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {isCorrect
                      ? "The distinction is clearer now."
                      : "There&apos;s still a gap in the mental model."}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {reassessmentResult.evidenceSummary}
                  </p>
                </div>
              </div>

              {/* Key takeaway */}
              <div className="mt-5 rounded-lg border border-white/80 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                  Key takeaway
                </p>

                <p className="mt-1.5 text-sm leading-6 text-slate-700">
                  {question.correctAnswerExplanation}
                </p>
              </div>
            </div>

            {/* Continue */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={onContinueSession}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] sm:w-auto"
              >
                Continue learning
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}