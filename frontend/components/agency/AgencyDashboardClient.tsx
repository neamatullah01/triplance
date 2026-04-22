"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Map,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Moon,
  Sun,
  Search,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Send,
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Star,
} from "lucide-react"

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const METRICS = {
  totalRevenue: 284900,
  activePackages: 12,
  totalBookings: 3624,
  averageRating: 4.8,
}

const RECENT_BOOKINGS = [
  {
    id: "BK-1024",
    traveler: "Sarah Jenkins",
    package: "Sundarbans Safari",
    status: "Confirmed",
    date: "Apr 6, 2026",
    amount: "$2,400",
  },
  {
    id: "BK-1023",
    traveler: "Marco Rossi",
    package: "Cox's Bazar Tour",
    status: "Pending",
    date: "Apr 5, 2026",
    amount: "$1,800",
  },
  {
    id: "BK-1022",
    traveler: "Amira Khan",
    package: "Sylhet Tea Retreat",
    status: "Completed",
    date: "Apr 4, 2026",
    amount: "$3,200",
  },
  {
    id: "BK-1021",
    traveler: "Julian Rivers",
    package: "Bandarban Trek",
    status: "Cancelled",
    date: "Apr 3, 2026",
    amount: "$4,100",
  },
  {
    id: "BK-1020",
    traveler: "Priya Sharma",
    package: "Sajek Valley",
    status: "Confirmed",
    date: "Apr 2, 2026",
    amount: "$2,900",
  },
]

const RECENT_ACTIVITY = [
  {
    icon: CheckCircle2,
    text: "Booking BK-1024 was confirmed",
    time: "2 hours ago",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    icon: Users,
    text: "New traveler joined your Sundarbans tour",
    time: "4 hours ago",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    icon: AlertTriangle,
    text: "Refund request for BK-1019",
    time: "6 hours ago",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    icon: Map,
    text: "Package 'Bandarban Trek' capacity is low",
    time: "8 hours ago",
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-500/10",
  },
  {
    icon: Star,
    text: "New 5-star review from Amira Khan",
    time: "12 hours ago",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
]

const PACKAGES = [
  {
    id: "PKG-01",
    title: "Cox's Bazar Beach Tour 3",
    price: 12500,
    capacity: 20,
    booked: 15,
    status: "Active",
  },
  {
    id: "PKG-02",
    title: "Sundarbans Wildlife Safari",
    price: 18000,
    capacity: 15,
    booked: 15,
    status: "Full",
  },
]

const POSTS = [
  {
    id: "PST-1",
    content:
      "Just wrapped up an amazing group tour in the Sundarbans! The wildlife was incredible today. 🐅🍃",
    likes: 124,
    comments: 18,
    time: "2 hours ago",
  },
]

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    completed: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    full: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status.toLowerCase()] || ""}`}
    >
      {status}
    </span>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
type Tab =
  | "overview"
  | "users"
  | "agencies"
  | "bookings"
  | "payments"
  | "posts"
  | "reviews"
type AgencyTab = "overview" | "packages" | "bookings" | "social" | "profile"

export function AgencyDashboardClient() {
  const [activeTab, setActiveTab] = useState<AgencyTab>("overview")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) setIsDarkMode(true)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  }

  const MENU_ITEMS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "packages", label: "Packages", icon: Map },
    { id: "bookings", label: "Bookings", icon: Users },
    { id: "social", label: "Social Feed", icon: ImageIcon },
    { id: "profile", label: "Profile", icon: Settings },
  ] as const

  // ─── TAB CONTENTS ─────────────────────────────────────────────────────────

  const OverviewTab = () => (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Real-time insights across your agency operations[cite: 1]
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "TOTAL REVENUE",
            value: formatCurrency(METRICS.totalRevenue),
            trend: "↑ +6.1% from last month",
            trendColor: "text-emerald-500",
            icon: DollarSign,
            bg: "bg-amber-100 text-amber-600 dark:bg-amber-500/20",
          },
          {
            label: "TOTAL BOOKINGS",
            value: METRICS.totalBookings.toLocaleString(),
            trend: "↑ +12.5% from last month",
            trendColor: "text-emerald-500",
            icon: CheckCircle2,
            bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20",
          },
          {
            label: "ACTIVE PACKAGES",
            value: METRICS.activePackages,
            trend: "Currently live",
            trendColor: "text-slate-500",
            icon: Map,
            bg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20",
          },
          {
            label: "AVG RATING",
            value: METRICS.averageRating,
            trend: "Based on traveler reviews",
            trendColor: "text-slate-500",
            icon: Star,
            bg: "bg-rose-100 text-rose-600 dark:bg-rose-500/20",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="mb-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                {stat.label}
              </p>
              <h3 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </h3>
              <p className={`text-xs font-medium ${stat.trendColor}`}>
                {stat.trend}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${stat.bg}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Table & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Bookings Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Bookings
            </h3>
            <button
              onClick={() => setActiveTab("bookings")}
              className="flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400"
            >
              View All <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:border-slate-800 dark:text-slate-500">
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Traveler</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {RECENT_BOOKINGS.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {booking.traveler}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {booking.package}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{booking.date}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                      {booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {RECENT_ACTIVITY.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className={`rounded-full p-2 ${item.bg} ${item.color} shrink-0`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm leading-snug font-medium text-slate-700 dark:text-slate-300">
                      {item.text}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <Clock className="h-3 w-3" /> {item.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const PackagesTab = () => (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Package Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, read, update, and delete travel packages[cite: 1]
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-indigo-700">
          <Plus className="h-5 w-5" /> New Package
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-start justify-between">
              <StatusBadge status={pkg.status} />
              <div className="flex items-center gap-1">
                <button className="rounded-lg bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="rounded-lg bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-slate-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
              {pkg.title}
            </h3>
            <p className="mb-4 text-xl font-bold text-indigo-600 dark:text-indigo-400">
              ৳{pkg.price.toLocaleString()}{" "}
              <span className="text-sm font-medium text-slate-500">
                / traveler
              </span>
            </p>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="mb-2 flex justify-between text-xs font-bold tracking-wider text-slate-500 uppercase">
                <span>Capacity</span>
                <span className="text-slate-900 dark:text-white">
                  {pkg.booked} / {pkg.capacity} Booked
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-1.5 rounded-full ${pkg.status === "Full" ? "bg-red-500" : "bg-indigo-500"}`}
                  style={{ width: `${(pkg.booked / pkg.capacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )

  const SocialTab = () => (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-3xl space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Social Feed
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Share past trip experiences and group updates directly to the main
          news feed[cite: 1]
        </p>
      </div>

      {/* Create Post */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <textarea
          placeholder="Share a trip update, photo, or promotional offer..."
          className="w-full resize-none rounded-xl border border-transparent bg-slate-50 p-4 text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800/50 dark:text-white dark:focus:border-indigo-700 dark:focus:ring-indigo-900"
          rows={3}
        ></textarea>
        <div className="mt-4 flex items-center justify-between">
          <button className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:hover:bg-slate-800">
            <Camera className="h-5 w-5" /> Add Photos
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-indigo-700">
            Post <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {POSTS.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                TA
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Test Agency
                </p>
                <p className="text-xs text-slate-500">{post.time}</p>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {post.content}
            </p>
            <div className="flex items-center gap-4 border-t border-slate-100 pt-4 text-xs font-bold text-slate-500 dark:border-slate-800">
              <span className="flex cursor-pointer items-center gap-1.5 hover:text-indigo-600">
                <Star className="h-4 w-4" /> {post.likes} Likes
              </span>
              <span className="flex cursor-pointer items-center gap-1.5 hover:text-indigo-600">
                <ImageIcon className="h-4 w-4" /> {post.comments} Comments
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FD] font-sans dark:bg-slate-950">
      {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo Area */}
        <div className="flex h-20 items-center border-b border-slate-100 px-6 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-600 p-1.5 text-white">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl leading-tight font-bold text-slate-900 dark:text-white">
                Triplance
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                Agency Portal
              </p>
            </div>
          </div>
          <button
            className="ml-auto text-slate-500 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
          <p className="mb-2 px-4 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Main Menu
          </p>
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`}
                />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="space-y-1 border-t border-slate-100 p-4 dark:border-slate-800">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50">
            <ChevronLeft className="h-5 w-5 text-slate-400" />
            Collapse
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/50 px-6 backdrop-blur-md lg:px-8 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="flex items-center gap-4">
            <button
              className="text-slate-500 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:block">
              <h2 className="text-lg font-bold text-slate-900 capitalize dark:text-white">
                {activeTab.replace("-", " ")}
              </h2>
              <p className="text-xs text-slate-500">
                Welcome back, Test Agency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Search Bar */}
            <div className="hidden w-64 items-center rounded-full border border-transparent bg-slate-100 px-4 py-2 transition-colors focus-within:border-indigo-300 md:flex dark:bg-slate-900 dark:focus-within:border-indigo-700">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="ml-2 w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              />
            </div>

            {/* Theme Toggle (Style matches screenshot) */}
            <button
              onClick={toggleTheme}
              className="relative flex h-7 w-14 items-center rounded-full bg-slate-900 p-1 transition-colors dark:bg-slate-800"
            >
              <div
                className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-300 ${isDarkMode ? "translate-x-7 bg-indigo-500" : "translate-x-0 bg-white"}`}
              >
                {isDarkMode ? (
                  <Moon className="h-3 w-3 text-white" />
                ) : (
                  <Sun className="h-3 w-3 text-slate-900" />
                )}
              </div>
            </button>

            {/* Notifications */}
            <button className="relative text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white dark:border-slate-950">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="flex cursor-pointer items-center gap-3 border-l border-slate-200 pl-2 lg:pl-4 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-md">
                T
              </div>
              <div className="hidden lg:block">
                <p className="text-sm leading-tight font-bold text-slate-900 dark:text-white">
                  Test Agency
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  Provider
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewTab key="overview" />}
            {activeTab === "packages" && <PackagesTab key="packages" />}
            {/* Bookings & Profile act as placeholders adapting the same design language */}
            {activeTab === "bookings" && (
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Booking Management
                </h1>
                <p className="text-sm text-slate-500">
                  View incoming bookings and manage traveler lists[cite: 1]
                </p>
              </motion.div>
            )}
            {activeTab === "profile" && (
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Agency Profile
                </h1>
                <p className="text-sm text-slate-500">
                  Public-facing page showcasing average rating and contact
                  info[cite: 1]
                </p>
              </motion.div>
            )}
            {activeTab === "social" && <SocialTab key="social" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
