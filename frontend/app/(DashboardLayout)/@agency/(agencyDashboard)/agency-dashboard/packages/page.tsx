"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const packagesData = [
  { id: "PKG-01", title: "Cox's Bazar Beach Tour",    price: 12500, duration: "3 Days", capacity: 20, booked: 15, status: "Active"   },
  { id: "PKG-02", title: "Sundarbans Wildlife Safari", price: 18000, duration: "4 Days", capacity: 15, booked: 15, status: "Full"     },
  { id: "PKG-03", title: "Sylhet Tea Garden Retreat",  price: 9500,  duration: "2 Days", capacity: 25, booked: 10, status: "Active"   },
  { id: "PKG-04", title: "Bandarban Hill Trek",        price: 14000, duration: "5 Days", capacity: 12, booked: 4,  status: "Active"   },
  { id: "PKG-05", title: "Sajek Valley Weekend",       price: 8500,  duration: "2 Days", capacity: 30, booked: 30, status: "Full"     },
  { id: "PKG-06", title: "Saint Martin Island Tour",   price: 11000, duration: "3 Days", capacity: 20, booked: 0,  status: "Inactive" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    full:     "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[status.toLowerCase()] || ""}`}>
      {status}
    </span>
  );
}

export default function AgencyPackagesPage() {
  const [search, setSearch] = useState("");
  const filtered = packagesData.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Packages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create, manage, and track your travel packages</p>
        </div>
        <button className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-600/25 self-start sm:self-auto shrink-0">
          <Plus className="h-4 w-4" /> New Package
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all"
        />
      </div>

      {/* Cards — 1 col → 2 col md → 3 col xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((pkg) => {
          const fillPct = Math.round((pkg.booked / pkg.capacity) * 100);
          return (
            <div key={pkg.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <StatusBadge status={pkg.status} />
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors" title="Edit">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{pkg.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{pkg.duration} &bull; {pkg.id}</p>
              </div>

              <p className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ৳{pkg.price.toLocaleString()}
                <span className="text-sm font-medium text-slate-500"> / traveler</span>
              </p>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Capacity</span>
                  <span className="text-slate-800 dark:text-slate-200">{pkg.booked} / {pkg.capacity} Booked</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-1.5 rounded-full transition-all ${fillPct >= 100 ? "bg-red-500" : fillPct >= 80 ? "bg-amber-500" : "bg-indigo-500"}`}
                    style={{ width: `${Math.min(fillPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
