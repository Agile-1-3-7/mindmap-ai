"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { ConceptMindmap } from "@/components/ConceptMindmap";

import {
  getStoredConcepts,
  getStoredAttempts,
  getActiveMisconception,
  resetDemoSession,
} from "@/lib/session-store";

import {
  ConceptNode,
  StudentAttempt,
  MisconceptionId,
} from "@/types";

import { INITIAL_CONCEPT_NODES } from "@/data/topics";

import {
  RefreshCwIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from "@/components/icons";

export default function ProgressPage() {
  const [concepts, setConcepts] =
    useState<ConceptNode[]>(INITIAL_CONCEPT_NODES);

  const [attempts, setAttempts] =
    useState<StudentAttempt[]>([]);

  const [activeMisconceptionId, setActiveMisconceptionId] =
    useState<MisconceptionId | null>(null);

  useEffect(() => {
    setConcepts(getStoredConcepts());
    setAttempts(getStoredAttempts());
    setActiveMisconceptionId(getActiveMisconception());
  }, []);

  const handleReset = () => {
    resetDemoSession();

    setConcepts(getStoredConcepts());
    setAttempts([]);
    setActiveMisconceptionId(null);
  };

  const masteredCount = concepts.filter(
    (concept) => concept.status === "mastered"
  ).length;

  const improvingCount = concepts.filter(
    (concept) => concept.status === "improving"
  ).length;

  const misconceptionCount = concepts.filter(
    (concept) => concept.status === "misconception"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between">

          <div className="max-w-2xl">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              ← Back to dashboard
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
              Your progress
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Knowledge map
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              See how your understanding is developing across the concepts
              you&apos;ve practiced.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RefreshCwIcon className="h-4 w-4" />
              Reset
            </button>

            <Link
              href="/session"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Practice again
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Summary */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-400">
              Concepts
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {concepts.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              being tracked
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-400">
              Mastered
            </p>

            <p className="mt-1 text-2xl font-semibold text-emerald-600">
              {masteredCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              concepts understood
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-400">
              Improving
            </p>

            <p className="mt-1 text-2xl font-semibold text-indigo-600">
              {improvingCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              concepts developing
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-400">
              Needs attention
            </p>

            <p className="mt-1 text-2xl font-semibold text-amber-600">
              {misconceptionCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              misconceptions found
            </p>
          </div>
        </section>

        {/* Knowledge map */}
        <section className="mt-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Your understanding
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Each concept changes as MindMap AI learns more about your
              reasoning.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ConceptMindmap
              concepts={concepts}
              attempts={attempts}
              activeMisconceptionId={activeMisconceptionId}
            />
          </div>
        </section>

        {/* Explanation */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheckIcon className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                How your map changes
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your concept status is updated from your assessment and
                reassessment answers. A misconception can move toward
                improvement as your later reasoning shows stronger
                understanding.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}