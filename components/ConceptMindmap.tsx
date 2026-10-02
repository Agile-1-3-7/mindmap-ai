"use client";

import React, { useState } from "react";
import { ConceptNode, MisconceptionId, StudentAttempt } from "@/types";
import { MISCONCEPTIONS_TAXONOMY } from "@/data/misconceptions";
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  SparklesIcon,
  ActivityIcon,
  ArrowRightIcon,
  LayersIcon,
} from "./icons";
import Link from "next/link";
import { INITIAL_CONCEPT_NODES } from "@/data/topics";

interface ConceptMindmapProps {
  concepts: ConceptNode[];
  attempts: StudentAttempt[];
  activeMisconceptionId: MisconceptionId | null;
}

export function ConceptMindmap({
  concepts = INITIAL_CONCEPT_NODES,
  attempts = [],
  activeMisconceptionId,
}: ConceptMindmapProps) {
  const [selectedConceptId, setSelectedConceptId] =
    useState<string>("concept-backprop");

  const effectiveConcepts =
    concepts.length > 0 ? concepts : INITIAL_CONCEPT_NODES;

  const selectedConcept =
    effectiveConcepts.find((c) => c.id === selectedConceptId) ||
    effectiveConcepts[0] ||
    INITIAL_CONCEPT_NODES[0];

  const selectedMisconception =
    selectedConcept?.misconceptionId
      ? MISCONCEPTIONS_TAXONOMY[selectedConcept.misconceptionId]
      : activeMisconceptionId
        ? MISCONCEPTIONS_TAXONOMY[activeMisconceptionId]
        : null;

  const relevantAttempts = attempts.filter((att) =>
    selectedConcept?.id === "concept-backprop"
      ? true
      : att.questionPrompt
          .toLowerCase()
          .includes(selectedConcept?.name.toLowerCase() || "")
  );

  const getStatus = (status: ConceptNode["status"]) => {
    switch (status) {
      case "mastered":
        return {
          label: "Mastered",
          icon: <CheckCircleIcon className="h-4 w-4 text-emerald-600" />,
          card: "border-emerald-200 bg-emerald-50/30",
          badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
        };

      case "improving":
        return {
          label: "Improving",
          icon: <ActivityIcon className="h-4 w-4 text-indigo-600" />,
          card: "border-indigo-200 bg-indigo-50/30",
          badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
          dot: "bg-indigo-500",
        };

      case "misconception":
        return {
          label: "Needs attention",
          icon: <AlertTriangleIcon className="h-4 w-4 text-amber-600" />,
          card: "border-amber-200 bg-amber-50/30",
          badge: "border-amber-200 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
        };

      case "not_started":
      default:
        return {
          label: "Not started",
          icon: (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" />
          ),
          card: "border-slate-200 bg-white",
          badge: "border-slate-200 bg-slate-50 text-slate-500",
          dot: "bg-slate-300",
        };
    }
  };

  return (
    <div className="space-y-6">

      {/* =========================================================
          CONCEPT OVERVIEW
      ========================================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

        <div className="flex flex-col gap-1 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Knowledge map
            </p>

            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              Your understanding
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Select a concept to see what your practice says about it.
            </p>
          </div>

          <span className="text-xs text-slate-400">
            {effectiveConcepts.length} concepts
          </span>
        </div>


        {/* Concept cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {effectiveConcepts.map((concept, index) => {
            const isSelected = concept.id === selectedConceptId;
            const status = getStatus(concept.status);

            return (
              <button
                key={concept.id}
                onClick={() => setSelectedConceptId(concept.id)}
                className={`group relative flex min-h-[175px] flex-col rounded-xl border p-4 text-left transition-all duration-200 ${status.card} ${
                  isSelected
                    ? "border-indigo-400 shadow-sm ring-2 ring-indigo-100"
                    : "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Concept {index + 1}
                  </span>

                  {status.icon}
                </div>

                <div className="mt-4">
                  <h4 className="text-base font-bold text-slate-900">
                    {concept.name}
                  </h4>

                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-500">
                    {concept.description}
                  </p>
                </div>

                <div className="mt-auto pt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                    />
                    {status.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>


        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Mastered
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Improving
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Needs attention
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            Not started
          </span>
        </div>
      </section>


      {/* =========================================================
          SELECTED CONCEPT
      ========================================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Selected concept
            </p>

            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              {selectedConcept.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              A closer look at what your answers reveal.
            </p>
          </div>

          <Link
            href="/session"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Practice again
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>


        {/* =====================================================
            MISCONCEPTION
        ===================================================== */}
        {selectedMisconception ? (
          <div className="mt-6 space-y-6">

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-amber-100 p-2">
                  <AlertTriangleIcon className="h-4 w-4 text-amber-700" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Needs clarification
                  </p>

                  <h4 className="mt-1 text-sm font-bold text-slate-900">
                    {selectedMisconception.name}
                  </h4>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {selectedMisconception.explanation.quick}
                  </p>
                </div>
              </div>
            </div>


            {/* Key distinction */}
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-900">
                The distinction to remember
              </p>

              <div className="grid gap-3 md:grid-cols-2">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {selectedMisconception.keyDistinction.termA}
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {selectedMisconception.keyDistinction.descriptionA}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {selectedMisconception.keyDistinction.termB}
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {selectedMisconception.keyDistinction.descriptionB}
                  </p>
                </div>

              </div>
            </div>


            {/* Analogy */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4 text-indigo-600" />

                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                  A useful way to think about it
                </p>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                &ldquo;{selectedMisconception.analogy}&rdquo;
              </p>
            </div>

          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/40 p-6 text-center">
            <CheckCircleIcon className="mx-auto h-8 w-8 text-emerald-600" />

            <h4 className="mt-3 text-base font-bold text-slate-900">
              {selectedConcept.status === "mastered"
                ? "You understand this concept"
                : "No issue has been identified yet"}
            </h4>

            <p className="mx-auto mt-1.5 max-w-lg text-sm leading-relaxed text-slate-500">
              {selectedConcept.status === "mastered"
                ? "Your recent answers show a consistent understanding of the core idea."
                : "Practice this concept in a session and MindMap AI will update its understanding from your reasoning."}
            </p>
          </div>
        )}


        {/* =====================================================
            PRACTICE HISTORY
        ===================================================== */}
        <div className="mt-7 border-t border-slate-100 pt-6">

          <div className="flex items-center gap-2">
            <LayersIcon className="h-4 w-4 text-slate-500" />

            <h4 className="text-sm font-semibold text-slate-900">
              Practice history
            </h4>

            <span className="text-xs text-slate-400">
              {relevantAttempts.length}{" "}
              {relevantAttempts.length === 1 ? "attempt" : "attempts"}
            </span>
          </div>


          {relevantAttempts.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                No answers have been submitted for this concept yet.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {relevantAttempts.map((att, i) => (
                <div
                  key={att.id || i}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                >

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold leading-relaxed text-slate-800">
                      {att.questionPrompt}
                    </p>

                    <span
                      className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                        att.isCorrect
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {att.isCorrect
                        ? "Correct"
                        : att.misconceptionId || "Needs review"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <p className="text-slate-600">
                      <span className="font-medium text-slate-800">
                        Your answer:
                      </span>{" "}
                      &ldquo;{att.studentAnswer}&rdquo;
                    </p>

                    <p className="text-slate-500">
                      <span className="font-medium text-slate-700">
                        What we noticed:
                      </span>{" "}
                      {att.evidenceSummary}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}