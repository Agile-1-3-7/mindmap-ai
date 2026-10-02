"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainIcon, RefreshCwIcon } from "./icons";
import { resetDemoSession } from "@/lib/session-store";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    resetDemoSession();

    setTimeout(() => {
      setResetting(false);
      window.location.reload();
    }, 350);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/learn", label: "Learn" },
    { href: "/session", label: "Session" },
    { href: "/progress", label: "Progress" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            BRAND
        ===================================================== */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <BrainIcon className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold tracking-tight text-slate-900">
                MindMap
              </span>

              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600">
                AI
              </span>
            </div>

            <span className="hidden text-[9px] font-medium text-slate-400 sm:block">
              Conceptual learning
            </span>
          </div>
        </Link>


        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>


        {/* =====================================================
            ACTIONS
        ===================================================== */}
        <div className="flex items-center gap-2">

          {/* Reset */}
          <button
            onClick={handleReset}
            title="Reset session attempts and progress"
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <RefreshCwIcon
              className={[
                "h-3.5 w-3.5",
                resetting
                  ? "animate-spin text-indigo-600"
                  : "text-slate-400",
              ].join(" ")}
            />

            <span className="hidden sm:inline">
              Reset
            </span>
          </button>


          {/* Primary CTA */}
          <Link
            href="/session"
            className="flex items-center justify-center rounded-md bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">
              Start session
            </span>

            <span className="sm:hidden">
              Start
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
}