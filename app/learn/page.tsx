import Link from "next/link";
import { TOPICS } from "@/data/topics";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  TargetIcon,
} from "@/components/icons";

export default function LearnPage() {
  const activeTopic = TOPICS.find((t) => t.id === "backprop")!;
  const comingSoonTopics = TOPICS.filter((t) => t.id !== "backprop");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="border-b border-slate-200 pb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Learn</span>
            <span>/</span>
            <span>Machine Learning</span>
            <span>/</span>
            <span className="text-indigo-600">Neural Networks</span>
          </div>

          <div className="mt-4 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              What do you want to learn?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Choose a topic and test your understanding through questions
              that focus on how you reason, not just whether you got the
              answer right.
            </p>
          </div>
        </div>


        {/* =====================================================
            FEATURED TOPIC
        ===================================================== */}
        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Available now
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Start with a topic
              </h2>
            </div>
          </div>


          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Top accent */}
            <div className="h-1 bg-indigo-600" />

            <div className="p-6 sm:p-8">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

                {/* Topic information */}
                <div className="max-w-3xl">

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      Machine Learning
                    </span>

                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Ready to practice
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {activeTopic.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    {activeTopic.description}
                  </p>

                  {/* Session details */}
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span>~{activeTopic.estimatedMinutes} minutes</span>
                    <span>•</span>
                    <span>{activeTopic.difficulty} difficulty</span>
                    <span>•</span>
                    <span>Diagnostic + reassessment</span>
                  </div>


                  {/* Concepts */}
                  <div className="mt-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Concepts covered
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">

                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <CheckCircleIcon className="h-4 w-4 shrink-0 text-indigo-500" />
                        <span className="text-xs font-medium text-slate-700">
                          Calculus chain rule
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <CheckCircleIcon className="h-4 w-4 shrink-0 text-indigo-500" />
                        <span className="text-xs font-medium text-slate-700">
                          Gradient vs. weight update
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <CheckCircleIcon className="h-4 w-4 shrink-0 text-indigo-500" />
                        <span className="text-xs font-medium text-slate-700">
                          Optimizer boundaries
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <CheckCircleIcon className="h-4 w-4 shrink-0 text-indigo-500" />
                        <span className="text-xs font-medium text-slate-700">
                          Activation derivatives
                        </span>
                      </div>

                    </div>
                  </div>
                </div>


                {/* Action panel */}
                <div className="w-full shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-5 lg:w-64">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <TargetIcon className="h-5 w-5" />
                  </div>

                  <h4 className="mt-4 text-sm font-bold text-slate-900">
                    Check your understanding
                  </h4>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Answer questions in your own words and see which concepts
                    need more attention.
                  </p>

                  <Link
                    href="/session"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    Start session
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/progress"
                    className="mt-2 flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    View your progress
                  </Link>

                </div>

              </div>
            </div>
          </div>
        </section>


        {/* =====================================================
            COMING SOON
        ===================================================== */}
        <section className="mt-12">

          <div className="flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                More topics
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                More learning modules
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              Coming soon
            </span>
          </div>


          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {comingSoonTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex min-h-[210px] flex-col rounded-xl border border-slate-200 bg-white p-5"
              >

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {topic.category}
                  </span>

                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                    Coming soon
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-800">
                  {topic.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {topic.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <span>
                    ~{topic.estimatedMinutes} mins
                  </span>

                  <span>
                    {topic.difficulty}
                  </span>
                </div>

              </div>
            ))}

          </div>
        </section>


        {/* =====================================================
            SMALL FOOTER NOTE
        ===================================================== */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-xs text-slate-400">
            MindMap AI currently focuses on conceptual understanding in
            neural networks. More subjects can be added to the same learning
            framework.
          </p>
        </div>

      </div>
    </main>
  );
}