import Link from "next/link";
import { VisualFlow } from "@/components/VisualFlow";
import {
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import { MISCONCEPTIONS_TAXONOMY } from "@/data/misconceptions";

export default function HomePage() {
  const taxonomyList = Object.values(MISCONCEPTIONS_TAXONOMY);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            {/* Small label */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <SparklesIcon className="h-3.5 w-3.5" />
              Conceptual learning, not just answer checking
            </div>

            {/* Main heading */}
            <h1 className="mt-7 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              MindMap
              <span className="text-indigo-600"> AI</span>
            </h1>

            <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
              Understand what you got wrong.
              <br className="hidden sm:block" />
              <span className="text-indigo-600">
                Fix why you got it wrong.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              MindMap AI looks beyond whether an answer is correct. It examines
              your reasoning, identifies possible misconceptions, explains the
              underlying idea, and checks whether your understanding improves.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/session"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
              >
                Start a practice session
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
              >
                Explore dashboard
              </Link>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" />
              <span>Works locally with the built-in diagnostic engine</span>
            </div>
          </div>

          {/* Simple product preview */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      Practice session
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      What happens during backpropagation?
                    </h3>
                  </div>

                  <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 sm:block">
                    Question 1 of 3
                  </span>
                </div>

                <div className="grid gap-5 pt-5 md:grid-cols-[1fr_260px]">

                  <div>
                    <p className="text-sm leading-6 text-slate-600">
                      Explain what happens to the weights during
                      backpropagation. Use your own words.
                    </p>

                    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                      <p className="text-xs font-medium text-slate-400">
                        Your explanation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        &ldquo;Backpropagation calculates the gradients and
                        changes the weights to reduce the error.&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      What MindMap checks
                    </p>

                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Your reasoning
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          What does the answer reveal?
                        </p>
                      </div>

                      <div className="border-t border-indigo-100 pt-3">
                        <p className="text-sm font-semibold text-slate-800">
                          Conceptual gap
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Is there a recurring misconception?
                        </p>
                      </div>

                      <div className="border-t border-indigo-100 pt-3">
                        <p className="text-sm font-semibold text-slate-800">
                          Reassessment
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Did the explanation actually help?
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              How it works
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              From mistake to understanding
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Instead of stopping when an answer is marked wrong, MindMap AI
              follows the reasoning behind it.
            </p>
          </div>

          <div className="mt-10">
            <VisualFlow />
          </div>

        </div>
      </section>


      {/* =========================================================
          PROBLEM / SOLUTION
      ========================================================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="grid gap-5 md:grid-cols-2">

            {/* Problem */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangleIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    The usual approach
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Correct answer. Move on.
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                A wrong answer tells you that something went wrong, but not
                necessarily what you misunderstood. The same conceptual mistake
                can therefore appear again in a different question.
              </p>

              <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-400">
                  Typical feedback
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  &ldquo;Incorrect. The correct answer is C.&rdquo;
                </p>
              </div>
            </div>


            {/* Solution */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    MindMap AI
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Understand the reasoning.
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                MindMap AI examines the explanation behind your answer, looks
                for a known conceptual misconception, provides a targeted
                explanation, and then gives you another question to test the
                same idea.
              </p>

              <div className="mt-5 rounded-lg border border-indigo-100 bg-white p-4">
                <p className="text-xs font-semibold text-indigo-600">
                  The learning loop
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                  <span>Answer</span>
                  <span className="text-slate-300">→</span>
                  <span>Diagnose</span>
                  <span className="text-slate-300">→</span>
                  <span>Explain</span>
                  <span className="text-slate-300">→</span>
                  <span>Reassess</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          TAXONOMY
      ========================================================= */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Diagnostic foundation
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                A structured set of misconceptions
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                The current demo uses a predefined taxonomy of conceptual
                mistakes so that diagnoses remain grounded and consistent.
              </p>
            </div>

            <Link
              href="/progress"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View knowledge map
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {taxonomyList.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
                    {item.id}
                  </span>

                  <span className="text-[11px] font-medium text-slate-400">
                    {item.concept}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[11px] leading-5 text-slate-400">
                    <span className="font-semibold text-slate-600">
                      Example:
                    </span>{" "}
                    {item.analogy.slice(0, 90)}
                    {item.analogy.length > 90 ? "..." : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">

          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Ready to try it?
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See what your answers reveal.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
            Start a short diagnostic session and see how MindMap AI moves from
            an answer to a misconception, intervention, and reassessment.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/session"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Start a session
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <Link
              href="/progress"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              View knowledge map
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}