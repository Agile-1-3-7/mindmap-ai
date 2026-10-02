import React from "react";
import { Misconception } from "@/types";
import {
  LightbulbIcon,
  ArrowRightIcon,
} from "./icons";

interface InterventionCardProps {
  misconception: Misconception;
  evidenceSummary: string;
  confidence: number;
  onProceedToReassessment: () => void;
}

export function InterventionCard({
  misconception,
  evidenceSummary,
  confidence,
  onProceedToReassessment,
}: InterventionCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <span className="text-sm font-bold">!</span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
              Concept check
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Something in your reasoning needs clarification
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              We found a possible gap in your mental model. Let&apos;s
              straighten it out before moving on.
            </p>
          </div>
        </div>
      </div>

      {/* Misconception */}
      <div className="px-6 py-6 sm:px-8">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              Your misconception
            </p>

            <span className="text-xs font-medium text-slate-400">
              {Math.round(confidence * 100)}% confidence
            </span>
          </div>

          <p className="mt-3 text-base font-semibold leading-7 text-slate-900">
            {misconception.name}
          </p>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
              Why we think this
            </p>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              {evidenceSummary}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-600">
            Let's straighten out the mental model
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {misconception.explanation.quick}
          </p>
        </div>

        {/* Key distinction */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                A
              </span>

              <h3 className="text-sm font-semibold text-slate-900">
                {misconception.keyDistinction.termA}
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {misconception.keyDistinction.descriptionA}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                B
              </span>

              <h3 className="text-sm font-semibold text-slate-900">
                {misconception.keyDistinction.termB}
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {misconception.keyDistinction.descriptionB}
            </p>
          </div>
        </div>

        {/* Mental model */}
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <LightbulbIcon className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-700">
                A simpler way to think about it
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {misconception.analogy}
              </p>
            </div>
          </div>
        </div>

        {/* Example */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
            Concrete example
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {misconception.example}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="max-w-md text-sm text-slate-500">
          Now let&apos;s see whether the corrected mental model has clicked.
        </p>

        <button
          onClick={onProceedToReassessment}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] sm:w-auto"
        >
          Test my understanding
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}