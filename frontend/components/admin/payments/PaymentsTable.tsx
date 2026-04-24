"use client";

import { useState } from "react";
import { Search, RotateCcw, Eye, DollarSign, SearchX } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Pagination } from "@/components/shared/Pagination";

interface Payment {
  id: string;
  bookingId: string;
  traveler: string;
  amount: string;
  status: string;
  gateway: string;
  transactionId: string;
  date: string;
}

interface PaymentsTableProps {
  initialPayments: Payment[];
  currentTab: string;
  summary: {
    totalPaid: number;
    totalRefunded: number;
    totalPending: number;
  };
  meta: any;
}

function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    unpaid:   "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    refunded: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[status] || ""}`}>{status}</span>;
}

export function PaymentsTable({ initialPayments, currentTab, summary, meta }: PaymentsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const handleTabChange = (f: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", f);
    router.push(`${pathname}?${params.toString()}`);
  };

  const filtered = initialPayments.filter((p) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return p.id.toLowerCase().includes(lowerSearch) || 
           p.bookingId.toLowerCase().includes(lowerSearch) ||
           p.traveler.toLowerCase().includes(lowerSearch) ||
           p.transactionId.toLowerCase().includes(lowerSearch);
  });

  const handleView = () => toast.info("View payment details coming soon");
  const handleRefund = () => toast.info("Refund functionality coming soon");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track all transactions and process refunds</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Collected", value: `$${summary.totalPaid.toLocaleString()}`,     icon: DollarSign, bg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" },
          { label: "Total Refunded",  value: `$${summary.totalRefunded.toLocaleString()}`, icon: RotateCcw,  bg: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"         },
          { label: "Pending",         value: `$${summary.totalPending.toLocaleString()}`,  icon: DollarSign, bg: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"             },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}><s.icon className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{s.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "paid", "unpaid", "refunded"].map((f) => (
            <button key={f} onClick={() => handleTabChange(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${currentTab === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No payments found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {search 
              ? `No results match your search for "${search}". Try adjusting your keywords.`
              : "There are no payments to display in this category right now."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 sm:px-6 py-3">Payment ID</th>
                  <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Booking</th>
                  <th className="px-4 sm:px-6 py-3">Traveler</th>
                  <th className="px-4 sm:px-6 py-3">Status</th>
                  <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Gateway</th>
                  <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Transaction</th>
                  <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 sm:px-6 py-3.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{p.id}</td>
                    <td className="px-4 sm:px-6 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">{p.bookingId}</td>
                    <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-900 dark:text-white">{p.traveler}</td>
                    <td className="px-4 sm:px-6 py-3.5"><PaymentStatusBadge status={p.status} /></td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-600 dark:text-slate-300 hidden md:table-cell">{p.gateway}</td>
                    <td className="px-4 sm:px-6 py-3.5 font-mono text-xs text-slate-400 dark:text-slate-500 hidden lg:table-cell">{p.transactionId}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{p.date}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right font-semibold text-slate-900 dark:text-white">{p.amount}</td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={handleView} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                        {p.status === "paid" && (
                          <button onClick={handleRefund} className="p-1.5 rounded-lg text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 transition-colors" title="Refund"><RotateCcw className="h-4 w-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
