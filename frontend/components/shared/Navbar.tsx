"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname
import { motion } from "framer-motion"; // Added framer-motion
import { Search, Bell, CircleUser, Menu, PlaneTakeoff, LogOut, User as UserIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { getUser, logoutUser } from "@/services/auth.service";

// Define your navigation links centrally
const navLinks = [
  { name: "Feed", href: "/feed" },
  { name: "Explore", href: "/explore" },
  { name: "Bookings", href: "/bookings" },
  { name: "Agency", href: "/agency" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL path
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        
        {/* Left section: Logo and Desktop Links */}
        <div className="flex items-center gap-10">
          {/* Logo with Icon */}
          <Link href="/feed" className="flex items-center gap-2 text-xl font-bold text-indigo-900 dark:text-indigo-300 tracking-tight">
            <PlaneTakeoff className="h-6 w-6 text-indigo-600" />
            Triplance
          </Link>

          {/* Desktop Navigation Links with Animated Underline */}
          <div className="hidden lg:flex items-center gap-6 mt-1">
            {navLinks.map((link) => {
              // Check if the current pathname starts with the link href (handles sub-routes too)
              const isActive = pathname.startsWith(link.href);

              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="relative pb-1 group"
                >
                  <span className={`text-sm transition-colors duration-200 ${
                    isActive 
                      ? "font-semibold text-indigo-800 dark:text-indigo-300" 
                      : "font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}>
                    {link.name}
                  </span>
                  
                  {/* Framer Motion Animated Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-800 dark:bg-indigo-300 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
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
              className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-foreground placeholder:text-slate-500 dark:placeholder:text-slate-400 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
            />
          </div>
          
          {/* Desktop Theme Toggle & Action Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <>
                <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer p-1">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative group">
                  <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center cursor-pointer p-1">
                    <CircleUser className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link href={`/${user?.role === 'AGENCY' ? 'agency' : 'profile'}`} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          <UserIcon className="h-4 w-4" />
                          My Profile
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors cursor-pointer"
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
                <button className="px-8 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full transition-all shadow-sm hover:shadow-lg hover:shadow-blue-900/60 cursor-pointer">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile: ThemeToggle + Notification + Profile icon + Hamburger (left to right) */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle size="8px" />
            {user ? (
              <>
                <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors p-1 cursor-pointer">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative group">
                  <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors p-1 flex items-center cursor-pointer">
                    <CircleUser className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link href={`/${user?.role === 'AGENCY' ? 'agency' : 'profile'}`} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          <UserIcon className="h-4 w-4" />
                          My Profile
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors cursor-pointer"
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
              <Link href="/login" className="px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full transition-all mr-1 shadow-sm hover:shadow-lg hover:shadow-blue-900/60 cursor-pointer">
                Login
              </Link>
            )}
            <button
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background absolute w-full left-0 top-full shadow-lg">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative w-full mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 text-foreground placeholder:text-slate-500 dark:placeholder:text-slate-400 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
              />
            </div>

            {/* Mobile Links with Active State */}
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`text-base ${
                    isActive 
                      ? "font-semibold text-indigo-800 dark:text-indigo-300" 
                      : "font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  }`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  );
}