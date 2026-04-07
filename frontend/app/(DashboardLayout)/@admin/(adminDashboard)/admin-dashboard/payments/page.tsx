"use client";

import { useState } from "react";
import { Search, RotateCcw, Eye, DollarSign } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const paymentsData = [
  { id: "PAY-4012", bookingId: "BK-1024", traveler: "Sarah Jenkins", amount: "$4,800", currency: "USD", status: "paid", gateway: "Stripe", transactionId: "txn_3Jk8mL2qW9", date: "Apr 6, 2026" },
  { id: "PAY-4011", bookingId: "BK-1023", traveler: "Marco Rossi", amount: "$1,800", currency: "USD", status: "unpaid", gateway: "—", transactionId: "—", date: "Apr 5, 2026" },
  { id: "PAY-4010", bookingId: "BK-1022", traveler: "Amira Khan", amount: "$9,600", currency: "USD", status: "paid", gateway: "Stripe", transactionId: "txn_9Pq4vN7rX1", date: "Apr 4, 2026" },
  { id: "PAY-4009", bookingId: "BK-1021", traveler: "Julian Rivers", amount: "$8,200", currency: "USD", status: "refunded", gateway: "Stripe", transactionId: "txn_1Mn6bC8tY5", date: "Apr 3, 2026" },
  { id: "PAY-4008", bookingId: "BK-1020", traveler: "Priya Sharma", amount: "$2,900", currency: "USD", status: "paid", gateway: "SSLCommerz", transactionId: "ssl_7Xw2eR4kM3", date: "Apr 2, 2026" },
  { id: "PAY-4007", bookingId: "BK-1019", traveler: "Chen Wei", amount: "$7,200", currency: "USD", status: "unpaid", gateway: "—", transactionId: "—", date: "Apr 1, 2026" },
];

function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    unpaid: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    refunded: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[status] || ""}`}>
      {status}
    </span>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = paymentsData.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  // Summary stats
  const totalPaid = paymentsData.filter((p) => p.status === "paid").reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, "")), 0);
  const totalRefunded = paymentsData.filter((p) => p.status === "refunded").reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, "")), 0);
  const totalPending = paymentsData.filter((p) => p.status === "unpaid").reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track all transactions and process refunds
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Collected</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">${totalPaid.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Refunded</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">${totalRefunded.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Pending</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">${totalPending.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {["all", "paid", "unpaid", "refunded"].map((f) => (
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
            placeholder="Search payments..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3">Payment ID</th>
                <th className="px-6 py-3">Booking</th>
                <th className="px-6 py-3">Traveler</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Gateway</th>
                <th className="px-6 py-3">Transaction</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{payment.id}</td>
                  <td className="px-6 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">{payment.bookingId}</td>
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">{payment.traveler}</td>
                  <td className="px-6 py-3.5"><PaymentStatusBadge status={payment.status} /></td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">{payment.gateway}</td>
                  <td className="px-6 py-3.5 font-mono text-xs text-slate-400 dark:text-slate-500">{payment.transactionId}</td>
                  <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{payment.date}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-slate-900 dark:text-white">{payment.amount}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      {payment.status === "paid" && (
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 transition-colors" title="Refund">
                          <RotateCcw className="h-4 w-4" />
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
