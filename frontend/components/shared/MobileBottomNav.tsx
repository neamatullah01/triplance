"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Users, User } from "lucide-react"

export function MobileBottomNav() {
  const pathname = usePathname()

  // Do not show the mobile nav on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-slate-200 bg-white/90 px-6 py-3 backdrop-blur-lg sm:hidden dark:border-slate-800 dark:bg-slate-950/90">
      <div className="pb-safe flex items-center justify-between">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold">Feed</span>
        </Link>

        <Link
          href="/explore"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/discover" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"}`}
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium">Discover</span>
        </Link>

        <Link
          href="/explorers"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/explorers" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"}`}
        >
          <Users className="h-5 w-5" />
          <span className="text-[10px] font-medium">Explorers</span>
        </Link>

        <Link
          href="/feed/profile"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname?.startsWith("/profile") ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"}`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  )
}
