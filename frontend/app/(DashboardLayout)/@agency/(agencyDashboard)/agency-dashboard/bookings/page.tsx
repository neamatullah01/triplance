"use client";

import { useState } from "react";
import { Search, Eye, XCircle } from "lucide-react";

const bookingsData = [
  { id: "BK-1024", traveler: "Sarah Jenkins",    package: "Sundarbans Safari",  status: "confirmed",  date: "Apr 6, 2026",  travelers: 2, amount: "$2,400" },
  { id: "BK-1023", traveler: "Marco Rossi",      package: "Cox's Bazar Tour",    status: "pending",    date: "Apr 5, 2026",  travelers: 1, amount: "$1,800" },
  { id: "BK-1022", traveler: "Amira Khan",       package: "Sylhet Tea Retreat",  status: "completed",  date: "Apr 4, 2026",  travelers: 3, amount: "$3,200" },
  { id: "BK-1021", traveler: "Julian Rivers",    package: "Bandarban Trek",      status: "cancelled",  date: "Apr 3, 2026",  travelers: 2, amount: "$4,100" },
  { id: "BK-1020", traveler: "Priya Sharma",     package: "Sajek Valley",        status: "confirmed",  date: "Apr 2, 2026",  travelers: 1, amount: "$2,900" },
  { id: "BK-1019", traveler: "Chen Wei",         package: "Cox's Bazar Tour",    status: "pending",    date: "Apr 1, 2026",  travelers: 4, amount: "$7,200" },
  { id: "BK-1018", traveler: "Fatima Al-Rashid", package: "Saint Martin Tour",   status: "confirmed",  date: "Mar 30, 2026", travelers: 2, amount: "$5,400" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    pending:   "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    completed: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[status] || ""}`}>
      {status}
    </span>
  );
}

export default function AgencyBookingsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = bookingsData.filter((b) => filter === "all" ? true : b.status === filter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Bookings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage all incoming traveler bookings</p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {/* Filter chips — scrollable on tiny screens */}
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
          />
        </div>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 sm:px-6 py-3">Booking ID</th>
                <th className="px-4 sm:px-6 py-3">Traveler</th>
                <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Package</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
                <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Pax</th>
                <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 sm:px-6 py-3 text-right">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{booking.id}</td>
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-900 dark:text-white">{booking.traveler}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-600 dark:text-slate-300 hidden md:table-cell">{booking.package}</td>
                  <td className="px-4 sm:px-6 py-3.5"><StatusBadge status={booking.status} /></td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-700 dark:text-slate-300 hidden lg:table-cell">{booking.travelers}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{booking.date}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right font-semibold text-slate-900 dark:text-white">{booking.amount}</td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors" title="Cancel">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
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
