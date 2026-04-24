"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logoutUser } from "@/services/auth.service"
import { toast } from "sonner"
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CreditCard,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
  PlaneTakeoff,
  LogOut,
  Shield,
  X,
} from "lucide-react"

const navItems = [
  { label: "Overview",  href: "/admin-dashboard",          icon: LayoutDashboard },
  { label: "Users",     href: "/admin-dashboard/users",    icon: Users           },
  { label: "Agencies",  href: "/admin-dashboard/agencies", icon: Building2       },
  { label: "Bookings",  href: "/admin-dashboard/bookings", icon: CalendarCheck   },
  { label: "Payments",  href: "/admin-dashboard/payments", icon: CreditCard      },
  { label: "Posts",     href: "/admin-dashboard/posts",    icon: FileText        },
  { label: "Reviews",   href: "/admin-dashboard/reviews",  icon: Star            },
]

interface AdminSidebarProps {
  isMobileOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ isMobileOpen, onClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900/95 ${collapsed ? "w-[72px]" : "w-64"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <PlaneTakeoff className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex-1 overflow-hidden">
            <h1 className="truncate text-base font-bold text-slate-900 dark:text-white">
              Triplance
            </h1>
            <p className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
              <Shield className="h-3 w-3" />
              Admin Panel
            </p>
          </div>
        )}
        {/* Mobile close */}
        {!collapsed && (
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 transition-colors hover:text-slate-700 lg:hidden dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Main Menu
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              } ${collapsed ? "justify-center" : ""} `}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : ""}`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {collapsed && (
                <span className="pointer-events-none absolute left-full z-50 ml-2 rounded-md bg-slate-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-700">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 space-y-2 border-t border-slate-200 px-3 py-4 dark:border-slate-800">
        {/* Collapse — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 lg:flex dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white ${collapsed ? "justify-center" : ""} `}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>

        <button
          onClick={handleLogout}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 ${collapsed ? "justify-center" : ""} `}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
