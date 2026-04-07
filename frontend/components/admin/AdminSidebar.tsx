"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin-dashboard/users", icon: Users },
  { label: "Agencies", href: "/admin-dashboard/agencies", icon: Building2 },
  { label: "Bookings", href: "/admin-dashboard/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/admin-dashboard/payments", icon: CreditCard },
  { label: "Posts", href: "/admin-dashboard/posts", icon: FileText },
  { label: "Reviews", href: "/admin-dashboard/reviews", icon: Star },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`
        flex flex-col h-full
        bg-slate-50 dark:bg-slate-900/80
        border-r border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shrink-0">
          <PlaneTakeoff className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">
              Triplance
            </h1>
            <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Main Menu
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {/* Tooltip on collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white
            transition-all duration-200
            ${collapsed ? "justify-center" : ""}
          `}
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

        {/* Logout */}
        <button
          className={`
            flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300
            transition-all duration-200
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
