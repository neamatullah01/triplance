"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, CircleUser, Menu, PlaneTakeoff } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-white relative z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        
        {/* Left section: Logo and Desktop Links */}
        <div className="flex items-center gap-10">
          {/* Logo with Icon */}
          <Link href="/feed" className="flex items-center gap-2 text-xl font-bold text-indigo-900 tracking-tight">
            <PlaneTakeoff className="h-6 w-6 text-indigo-600" />
            Triplance
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 mt-1">
            <Link href="/feed" className="text-sm font-semibold text-indigo-800 border-b-2 border-indigo-800 pb-1">
              Feed
            </Link>
            <Link href="/explore" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors pb-1">
              Explore
            </Link>
            <Link href="/bookings" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors pb-1">
              Bookings
            </Link>
            <Link href="/agency" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors pb-1">
              Agency
            </Link>
          </div>
        </div>

        {/* Right section: Search, Actions, and Toggle */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-slate-100 placeholder:text-slate-500 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          
          {/* Desktop Theme Toggle & Action Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <button className="text-slate-500 hover:text-slate-900 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-slate-500 hover:text-slate-900 transition-colors">
              <CircleUser className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile: ThemeToggle + Notification + Profile icon + Hamburger (left to right) */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle size="9px" />
            <button className="text-slate-500 hover:text-slate-900 transition-colors p-1">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-slate-500 hover:text-slate-900 transition-colors p-1">
              <CircleUser className="h-6 w-6" />
            </button>
            <button 
              className="p-2 text-slate-500 hover:text-slate-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white absolute w-full left-0 top-full shadow-lg">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative w-full mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-3 bg-slate-100 placeholder:text-slate-500 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Mobile Links */}
            <Link href="/feed" className="text-base font-semibold text-indigo-800" onClick={() => setIsMobileMenuOpen(false)}>Feed</Link>
            <Link href="/explore" className="text-base font-medium text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
            <Link href="/bookings" className="text-base font-medium text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Bookings</Link>
            <Link href="/agency" className="text-base font-medium text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Agency</Link>


          </div>
        </div>
      )}
    </nav>
  );
}