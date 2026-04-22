"use client";

import { Menu, Search, Bell } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface AgencyTopBarProps {
  onMenuClick: () => void;
}

export function AgencyTopBar({ onMenuClick }: AgencyTopBarProps) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
            Agency Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5">
            Welcome back, Agency
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search — md+ */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-48 lg:w-56 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 placeholder:text-slate-400 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all"
          />
        </div>

        <ThemeToggle size="8px" />

        {/* Bell */}
        <button className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              Agency
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Travel Provider
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
