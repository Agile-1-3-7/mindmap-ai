import {
  AlertTriangleIcon,
  SparklesIcon,
  TargetIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "./icons";

const steps = [
  {
    number: "01",
    title: "Wrong answer",
    description:
      "You explain your thinking in your own words, giving MindMap AI more than just a final answer.",
    icon: AlertTriangleIcon,
  },
  {
    number: "02",
    title: "Reasoning is examined",
    description:
      "Your response is compared with patterns from your answers to understand how you are thinking.",
    icon: SparklesIcon,
  },
  {
    number: "03",
    title: "Misconception identified",
    description:
      "A likely conceptual gap is identified when your reasoning matches a known misconception.",
    icon: TargetIcon,
  },
  {
    number: "04",
    title: "Understanding is clarified",
    description:
      "You receive a focused explanation designed to address the specific distinction you missed.",
    icon: SparklesIcon,
  },
  {
    number: "05",
    title: "Understanding is checked",
    description:
      "A fresh question checks whether you can apply the idea after the explanation.",
    icon: CheckCircleIcon,
  },
];

export function VisualFlow() {
  return (
    <div className="relative">

      {/* Desktop connecting line */}
      <div className="absolute left-[10%] right-[10%] top-[42px] hidden h-px bg-slate-200 lg:block" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.number} className="relative">

              {/* Card */}
              <div className="group relative h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md">

                {/* Number / icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-xs font-semibold tabular-nums text-slate-300">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-5">
                  <h3 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {step.description}
                  </p>
                </div>

                {/* Bottom indicator */}
                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                  <span className="text-[11px] font-medium text-slate-400">
                    Step {step.number}
                  </span>
                </div>
              </div>

              {/* Mobile / tablet connector */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2 lg:hidden">
                  <ArrowRightIcon className="h-4 w-4 rotate-90 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Small explanatory footer */}
      <div className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center text-xs text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
        <span>
          The goal is not simply to find the mistake, but to find the idea
          behind it.
        </span>
      </div>
    </div>
  );
}