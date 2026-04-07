"use client";

import { Search, Bell, CircleUser } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

export function AdminTopBar() {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      {/* Left: Page title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Dashboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
          Welcome back, Admin
        </p>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-56 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-foreground placeholder:text-slate-400 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all"
          />
        </div>

        <ThemeToggle size="8px" />

        {/* Notification Bell */}
        <button className="relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              Admin
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
