import Link from "next/link";
import { BrainIcon } from "./icons";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                <BrainIcon className="h-4 w-4" />
              </div>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">MindMap AI</span>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Hackathon MVP
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
              &ldquo;Don&apos;t just fix wrong answers. Fix the thinking behind them.&rdquo; AI diagnostic engine targeting deep conceptual misconceptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Dashboard
            </Link>
            <Link href="/learn" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Learn Topics
            </Link>
            <Link href="/session" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Interactive Session
            </Link>
            <Link href="/progress" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              MindMap Progress
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-6 text-center text-[11px] text-zinc-400 dark:border-zinc-900 dark:text-zinc-500">
          Built for demo with resilient deterministic fallback and live OpenAI / Supabase integration ready.
        </div>
      </div>
    </footer>
  );
}
