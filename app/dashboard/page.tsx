"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TOPICS, INITIAL_CONCEPT_NODES } from "@/data/topics";
import { MISCONCEPTIONS_TAXONOMY } from "@/data/misconceptions";
import {
  getStoredAttempts,
  getStoredConcepts,
  getActiveMisconception,
} from "@/lib/session-store";
import { StudentAttempt, ConceptNode, MisconceptionId } from "@/types";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  ActivityIcon,
  BookOpenIcon,
  CheckCircleIcon,
  LayersIcon,
} from "@/components/icons";

export default function DashboardPage() {
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [concepts, setConcepts] =
    useState<ConceptNode[]>(INITIAL_CONCEPT_NODES);
  const [activeMisconceptionId, setActiveMisconceptionId] =
    useState<MisconceptionId | null>(null);

  useEffect(() => {
    setAttempts(getStoredAttempts());
    setConcepts(getStoredConcepts());
    setActiveMisconceptionId(getActiveMisconception());
  }, []);

  const activeMisconception = activeMisconceptionId
    ? MISCONCEPTIONS_TAXONOMY[activeMisconceptionId]
    : MISCONCEPTIONS_TAXONOMY["M01"];

  const masteredCount = concepts.filter(
    (c) => c.status === "mastered"
  ).length;

  const improvingCount = concepts.filter(
    (c) => c.status === "improving"
  ).length;

  const misconceptionCount = concepts.filter(
    (c) => c.status === "misconception"
  ).length;

  const totalConcepts = concepts.length || 1;

  const diagnosedCount = useMemo(
    () => concepts.filter((c) => c.status !== "not_started").length,
    [concepts]
  );

  const progressPercent = Math.round(
    ((masteredCount + improvingCount * 0.5) / totalConcepts) * 100
  );

  const recentAttempts = attempts.slice(-4).reverse();

  const activeTopic = TOPICS.find(
    (topic) => topic.status === "active"
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-zinc-900 sm:px-6 lg:px-8">
      <div className="space-y-8">

        {/* HEADER */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-600">
              Your learning dashboard
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Keep building your understanding.
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
              MindMap AI looks beyond whether an answer is right or wrong to
              identify the concepts you may be misunderstanding.
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <BookOpenIcon className="h-4 w-4" />
              Topics
            </Link>

            <Link
              href="/session"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Continue learning
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* PROGRESS */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Overall mastery
                  </p>

                  <p className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
                    {progressPercent}%
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ActivityIcon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-zinc-500">
                <span>{masteredCount} mastered</span>
                <span>{improvingCount} improving</span>
                <span>
                  {totalConcepts - diagnosedCount} not assessed
                </span>
              </div>
            </div>

            <div className="border-t border-zinc-200 bg-zinc-50 p-6 lg:border-l lg:border-t-0 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Current focus
              </p>

              <h2 className="mt-2 text-lg font-semibold text-zinc-950">
                {activeMisconception.concept}
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                {activeMisconception.name}
              </p>

              <Link
                href="/session"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Work on this concept
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="Mastered"
            value={masteredCount}
            icon={<CheckCircleIcon className="h-4 w-4" />}
          />

          <Stat
            label="Improving"
            value={improvingCount}
            icon={<ActivityIcon className="h-4 w-4" />}
          />

          <Stat
            label="Needs attention"
            value={misconceptionCount}
            icon={<AlertTriangleIcon className="h-4 w-4" />}
          />

          <Stat
            label="Attempts"
            value={attempts.length}
            icon={<LayersIcon className="h-4 w-4" />}
          />
        </section>

        {/* FOCUS + ACTIVITY */}
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

          {/* FOCUS CARD */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">

            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <AlertTriangleIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Needs attention
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                    {activeMisconception.name}
                  </h2>
                </div>
              </div>

              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                {activeMisconception.id}
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-600">
              {activeMisconception.explanation.quick}
            </p>

            <div className="mt-5 rounded-xl bg-zinc-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                What to work on
              </p>

              <p className="mt-1.5 text-sm leading-6 text-zinc-700">
                {activeMisconception.analogy}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-zinc-500">
                Concept: {activeMisconception.concept}
              </span>

              <Link
                href="/session"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Start targeted session
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Recent activity
                </p>

                <h2 className="mt-1 text-lg font-semibold text-zinc-950">
                  Your latest work
                </h2>
              </div>

              <Link
                href="/progress"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-4">

              {recentAttempts.length > 0 ? (
                recentAttempts.map((attempt, index) => (
                  <ActivityItem
                    key={attempt.id || index}
                    attempt={attempt}
                  />
                ))
              ) : (
                <>
                  <ActivityPlaceholder
                    tone="amber"
                    title="Misconception identified"
                    label="M01"
                    text="Backpropagation and weight updates were conflated."
                  />

                  <ActivityPlaceholder
                    tone="green"
                    title="Concept strengthened"
                    label="Loss"
                    text="Distinction between loss and gradients was established."
                  />

                  <ActivityPlaceholder
                    tone="green"
                    title="Concept strengthened"
                    label="Optimization"
                    text="Gradient descent update rule was understood."
                  />
                </>
              )}

            </div>
          </div>
        </section>

        {/* TOPICS */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Learning paths
              </p>

              <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                Topics
              </h2>
            </div>

            <Link
              href="/learn"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Browse all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {TOPICS.map((topic) => {
              const isActive = topic.status === "active";

              return (
                <div
                  key={topic.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                    isActive
                      ? "border-blue-200 hover:border-blue-300 hover:shadow-md"
                      : "border-zinc-200 opacity-70"
                  }`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        {topic.category}
                      </p>

                      <h3 className="mt-1.5 font-semibold text-zinc-950">
                        {topic.title}
                      </h3>
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {isActive ? "Available" : "Coming soon"}
                    </span>

                  </div>

                  <p className="mt-2 text-sm leading-5 text-zinc-600">
                    {topic.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">

                    <span className="text-zinc-500">
                      {topic.estimatedMinutes} min · {topic.difficulty}
                    </span>

                    {isActive && activeTopic?.id === topic.id ? (
                      <Link
                        href="/session"
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Start
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <span className="text-zinc-400">
                        Locked
                      </span>
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        </section>

      </div>
    </main>
  );
}

/* ---------------------------------- */
/* STAT CARD */
/* ---------------------------------- */

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
        {icon}
      </div>

      <div>
        <p className="text-xl font-semibold text-zinc-950">
          {value}
        </p>

        <p className="text-[11px] text-zinc-500">
          {label}
        </p>
      </div>

    </div>
  );
}

/* ---------------------------------- */
/* ACTIVITY ITEM */
/* ---------------------------------- */

function ActivityItem({
  attempt,
}: {
  attempt: StudentAttempt;
}) {
  return (
    <div className="border-l-2 border-zinc-200 pl-3">

      <div className="flex items-center justify-between gap-2">

        <span className="text-xs font-semibold text-zinc-800">
          {attempt.isCorrect
            ? "Answer verified"
            : "Misconception found"}
        </span>

        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            attempt.isCorrect
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {attempt.isCorrect
            ? "Correct"
            : attempt.misconceptionId || "Review"}
        </span>

      </div>

      <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
        {attempt.questionPrompt}
      </p>

      <p className="mt-1 text-[10px] text-zinc-400">
        {attempt.timestamp
          ? new Date(attempt.timestamp).toLocaleTimeString()
          : "Just now"}
      </p>

    </div>
  );
}

/* ---------------------------------- */
/* EMPTY ACTIVITY ITEM */
/* ---------------------------------- */

function ActivityPlaceholder({
  tone,
  title,
  label,
  text,
}: {
  tone: "amber" | "green";
  title: string;
  label: string;
  text: string;
}) {
  return (
    <div
      className={`border-l-2 pl-3 ${
        tone === "amber"
          ? "border-amber-400"
          : "border-emerald-400"
      }`}
    >

      <div className="flex items-center justify-between gap-2">

        <span className="text-xs font-semibold text-zinc-800">
          {title}
        </span>

        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            tone === "amber"
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {label}
        </span>

      </div>

      <p className="mt-1 text-xs leading-5 text-zinc-500">
        {text}
      </p>

      <span className="text-[10px] text-zinc-400">
        Demo data
      </span>

    </div>
  );
}