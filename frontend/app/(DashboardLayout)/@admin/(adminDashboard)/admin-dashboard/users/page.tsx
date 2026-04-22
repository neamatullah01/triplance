"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Shield, Ban, UserCheck } from "lucide-react";

const usersData = [
  { id: 1, name: "Sarah Jenkins",      email: "sarah@email.com",   role: "traveler", status: "active",  joined: "Mar 12, 2026", bookings: 5  },
  { id: 2, name: "Marco Rossi",        email: "marco@email.com",   role: "traveler", status: "active",  joined: "Feb 28, 2026", bookings: 3  },
  { id: 3, name: "Julian Rivers",      email: "julian@email.com",  role: "traveler", status: "banned",  joined: "Jan 15, 2026", bookings: 0  },
  { id: 4, name: "Amira Khan",         email: "amira@email.com",   role: "traveler", status: "active",  joined: "Mar 22, 2026", bookings: 8  },
  { id: 5, name: "Priya Sharma",       email: "priya@email.com",   role: "traveler", status: "active",  joined: "Apr 1, 2026",  bookings: 1  },
  { id: 6, name: "Nomad Expeditions",  email: "contact@nomadexp.com", role: "agency", status: "active", joined: "Dec 10, 2025", bookings: 42 },
  { id: 7, name: "AquaVenture Tours",  email: "info@aquaventure.co",  role: "agency", status: "active", joined: "Feb 5, 2026",  bookings: 18 },
  { id: 8, name: "EcoStay Travels",    email: "hello@ecostay.com",    role: "agency", status: "pending",joined: "Apr 3, 2026",  bookings: 0  },
];

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin:    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    traveler: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    agency:   "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[role] || ""}`}>{role}</span>;
}

function StatusDot({ status }: { status: string }) {
  const color = status === "active" ? "bg-emerald-500" : status === "banned" ? "bg-red-500" : "bg-amber-500";
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="capitalize text-slate-700 dark:text-slate-300">{status}</span>
    </span>
  );
}

export default function UsersPage() {
  const [filter, setFilter] = useState("all");
  const filtered = usersData.filter((u) => {
    if (filter === "all") return true;
    if (filter === "travelers") return u.role === "traveler";
    if (filter === "agencies")  return u.role === "agency";
    if (filter === "banned")    return u.status === "banned";
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all platform users and their access</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{usersData.length} total users</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "travelers", "agencies", "banned"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${filter === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 sm:px-6 py-3">User</th>
                <th className="px-4 sm:px-6 py-3">Role</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
                <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Joined</th>
                <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Bookings</th>
                <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5"><RoleBadge role={user.role} /></td>
                  <td className="px-4 sm:px-6 py-3.5"><StatusDot status={user.status} /></td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden md:table-cell">{user.joined}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-700 dark:text-slate-300 font-medium hidden sm:table-cell">{user.bookings}</td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {user.status === "banned" ? (
                        <button className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors" title="Unban"><UserCheck className="h-4 w-4" /></button>
                      ) : (
                        <button className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" title="Ban"><Ban className="h-4 w-4" /></button>
                      )}
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="More"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
