"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth.service";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlaneTakeoff,
  LogOut,
  Briefcase,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview",  href: "/agency-dashboard",          icon: LayoutDashboard },
  { label: "Packages",  href: "/agency-dashboard/packages",  icon: Map            },
  { label: "Bookings",  href: "/agency-dashboard/bookings",  icon: CalendarCheck  },
  { label: "Social",    href: "/agency-dashboard/social",    icon: ImageIcon      },
  { label: "Profile",   href: "/agency-dashboard/profile",   icon: Settings       },
];

interface AgencySidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

export function AgencySidebar({ isMobileOpen, onClose }: AgencySidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        bg-slate-50 dark:bg-slate-900/95
        border-r border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shrink-0">
          <PlaneTakeoff className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">
              Triplance
            </h1>
            <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              Agency Portal
            </p>
          </div>
        )}
        {/* Mobile close button */}
        {!collapsed && (
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
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
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
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
        {/* Collapse — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
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

        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700
            transition-all duration-200 cursor-pointer
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
