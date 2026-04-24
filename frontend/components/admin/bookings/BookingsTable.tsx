"use client";

import { useState } from "react";
import { Search, Eye, XCircle, SearchX } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Booking {
  id: string;
  traveler: string;
  package: string;
  agency: string;
  status: string;
  date: string;
  travelers: number;
  amount: string;
}

interface BookingsTableProps {
  initialBookings: Booking[];
  currentTab: string;
}

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

export function BookingsTable({ initialBookings, currentTab }: BookingsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const handleTabChange = (f: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", f);
    router.push(`${pathname}?${params.toString()}`);
  };

  const filtered = initialBookings.filter((b) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return b.id.toLowerCase().includes(lowerSearch) || 
           b.traveler.toLowerCase().includes(lowerSearch) || 
           b.package.toLowerCase().includes(lowerSearch) ||
           b.agency.toLowerCase().includes(lowerSearch);
  });

  const handleView = () => toast.info("View booking details coming soon");
  const handleCancel = () => toast.info("Cancel booking coming soon");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Bookings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor and manage all platform bookings</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
            <button key={f} onClick={() => handleTabChange(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${currentTab === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No bookings found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {search 
              ? `No results match your search for "${search}". Try adjusting your keywords.`
              : "There are no bookings to display in this category right now."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 sm:px-6 py-3">Booking ID</th>
                  <th className="px-4 sm:px-6 py-3">Traveler</th>
                  <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Package</th>
                  <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Agency</th>
                  <th className="px-4 sm:px-6 py-3">Status</th>
                  <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Pax</th>
                  <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 sm:px-6 py-3.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{b.id}</td>
                    <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-900 dark:text-white">{b.traveler}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-600 dark:text-slate-300 hidden md:table-cell">{b.package}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{b.agency}</td>
                    <td className="px-4 sm:px-6 py-3.5"><StatusBadge status={b.status} /></td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-700 dark:text-slate-300 hidden lg:table-cell">{b.travelers}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{b.date}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right font-semibold text-slate-900 dark:text-white">{b.amount}</td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={handleView} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                        {b.status !== "cancelled" && b.status !== "completed" && (
                          <button onClick={handleCancel} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors" title="Cancel"><XCircle className="h-4 w-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
