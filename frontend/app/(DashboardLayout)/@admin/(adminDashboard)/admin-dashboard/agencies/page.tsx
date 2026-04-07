"use client";

import { useState } from "react";
import { Search, CheckCircle2, XCircle, ExternalLink, MapPin, Mail } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const agenciesData = [
  { id: 1, name: "Nomad Expeditions", email: "contact@nomadexp.com", location: "Kathmandu, Nepal", verified: true, rating: 4.8, packages: 12, submitted: "Dec 10, 2025" },
  { id: 2, name: "AquaVenture Tours", email: "info@aquaventure.co", location: "Phuket, Thailand", verified: true, rating: 4.5, packages: 8, submitted: "Feb 5, 2026" },
  { id: 3, name: "Wanderlust Co.", email: "team@wanderlustco.io", location: "Barcelona, Spain", verified: true, rating: 4.2, packages: 15, submitted: "Jan 18, 2026" },
  { id: 4, name: "EcoStay Travels", email: "hello@ecostay.com", location: "San José, Costa Rica", verified: false, rating: 0, packages: 0, submitted: "Apr 3, 2026" },
  { id: 5, name: "Alpine Adventures", email: "info@alpineadv.ch", location: "Zurich, Switzerland", verified: false, rating: 0, packages: 0, submitted: "Apr 5, 2026" },
  { id: 6, name: "Sahara Expeditions", email: "book@saharaexp.ma", location: "Marrakech, Morocco", verified: false, rating: 0, packages: 0, submitted: "Apr 6, 2026" },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AgenciesPage() {
  const [filter, setFilter] = useState("all");

  const filtered = agenciesData.filter((a) => {
    if (filter === "all") return true;
    if (filter === "verified") return a.verified;
    if (filter === "pending") return !a.verified;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agency Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Approve, manage, and monitor travel agencies
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {["all", "verified", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search agencies..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
          />
        </div>
      </div>

      {/* Agency Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((agency) => (
          <div
            key={agency.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                  {agency.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{agency.name}</h3>
                    {agency.verified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {agency.location}
                  </p>
                </div>
              </div>
              {!agency.verified && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  Pending
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <Mail className="h-3.5 w-3.5" /> {agency.email}
            </div>

            {agency.verified ? (
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{agency.rating}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Rating</p>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{agency.packages}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Packages</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 italic">
                Submitted on {agency.submitted}
              </p>
            )}

            <div className="flex items-center gap-2">
              {agency.verified ? (
                <>
                  <button className="flex-1 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 rounded-lg transition-colors flex items-center justify-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5" /> View Profile
                  </button>
                  <button className="py-2 px-3 text-xs font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition-colors">
                    Ban
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition-colors">
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
