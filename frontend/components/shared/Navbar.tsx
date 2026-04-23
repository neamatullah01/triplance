"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation" // Added usePathname
import { motion } from "framer-motion" // Added framer-motion
import {
  Search,
  Bell,
  CircleUser,
  Menu,
  PlaneTakeoff,
  LogOut,
  User as UserIcon,
} from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { getUser, logoutUser } from "@/services/auth.service"

// Define your navigation links centrally
const navLinks = [
  { name: "Feed", href: "/feed" },
  { name: "Explore", href: "/explore" },
  { name: "Bookings", href: "/bookings" },
  { name: "Agency", href: "/agency" },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname() // Get current URL path
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    router.push("/login")
  }

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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Left section: Logo and Desktop Links */}
        <div className="flex items-center gap-10">
          {/* Logo with Icon */}
          <Link
            href="/feed"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-indigo-900 dark:text-indigo-300"
          >
            <PlaneTakeoff className="h-6 w-6 text-indigo-600" />
            Triplance
          </Link>

          {/* Desktop Navigation Links with Animated Underline */}
          <div className="mt-1 hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              // Check if the current pathname starts with the link href (handles sub-routes too)
              const isActive = pathname.startsWith(link.href)

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group relative pb-1"
                >
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      isActive
                        ? "font-semibold text-indigo-800 dark:text-indigo-300"
                        : "font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    }`}
                  >
                    {link.name}
                  </span>

                  {/* Framer Motion Animated Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-indigo-800 dark:bg-indigo-300"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right section: Search, Actions, and Toggle */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-48 rounded-full border-none bg-slate-100 py-2 pr-4 pl-10 text-sm text-foreground transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none lg:w-64 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:focus:ring-indigo-900"
            />
          </div>

          {/* Desktop Theme Toggle & Action Icons */}
          <div className="hidden items-center gap-4 lg:flex">
            <ThemeToggle />
            {user ? (
              <>
                <button className="cursor-pointer p-1 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="group relative">
                  <button className="flex cursor-pointer items-center p-1 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                    <CircleUser className="h-6 w-6" />
                  </button>
                  <div className="invisible absolute top-full right-0 z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="w-56 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {user?.name || "User"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href={`/${user?.role === "AGENCY" ? "agency" : "feed/profile"}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                        >
                          <UserIcon className="h-4 w-4" />
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="cursor-pointer rounded-full bg-indigo-600 px-8 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-blue-900/60">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile: ThemeToggle + Notification + Profile icon + Hamburger (left to right) */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle size="8px" />
            <button className="cursor-pointer p-1 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              <Bell className="h-5 w-5" />
            </button>

            <button
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full border-t border-border bg-background shadow-lg lg:hidden">
          <div className="flex flex-col space-y-4 px-4 py-6">
            {/* Mobile Search */}
            <div className="relative mb-4 w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full rounded-lg border-none bg-slate-100 py-3 pr-4 pl-10 text-sm text-foreground placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none dark:bg-slate-800 dark:placeholder:text-slate-400 dark:focus:ring-indigo-900"
              />
            </div>

            {/* Mobile Links with Active State */}
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base ${
                    isActive
                      ? "font-semibold text-indigo-800 dark:text-indigo-300"
                      : "font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
