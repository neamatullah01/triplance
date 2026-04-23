"use client"

import { Menu, Search, Bell } from "lucide-react"
import ThemeToggle from "@/components/shared/ThemeToggle"
import { getUser } from "@/services/auth.service"
import { useEffect, useState } from "react"

interface AgencyTopBarProps {
  onMenuClick: () => void
}

export function AgencyTopBar({ onMenuClick }: AgencyTopBarProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user", error)
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="-ml-1 rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-base leading-tight font-bold text-slate-900 sm:text-lg dark:text-white">
            Agency Dashboard
          </h2>
          <p className="-mt-0.5 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
            Welcome back, {user?.name || "Agency"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search — md+ */}
        <div className="relative hidden md:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-48 rounded-xl border-none bg-slate-100 py-2 pr-4 pl-10 text-sm transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none lg:w-56 dark:bg-slate-800 dark:focus:ring-indigo-900"
          />
        </div>

        <ThemeToggle size="8px" />

        {/* Bell */}
        <button className="relative p-1.5 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <Bell className="h-5 w-5" />
          {/* <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span> */}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3 dark:border-slate-700">
          {user?.profileImage ? (
            <img 
              src={user.profileImage}
              alt={user?.name || "Agency"}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white uppercase">
              {user?.name ? user.name.charAt(0) : "A"}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="max-w-[120px] truncate text-sm leading-tight font-semibold text-slate-900 dark:text-white">
              {user?.name || "Agency"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Travel Provider
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
