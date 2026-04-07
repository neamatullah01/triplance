import { StatCard } from "@/components/admin/StatCard";
import {
  Users,
  CalendarCheck,
  DollarSign,
  Building2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const recentBookings = [
  { id: "BK-1024", traveler: "Sarah Jenkins", package: "Patagonia Circuit", status: "confirmed", date: "Apr 6, 2026", amount: "$2,400" },
  { id: "BK-1023", traveler: "Marco Rossi", package: "Kyoto Temple Trail", status: "pending", date: "Apr 5, 2026", amount: "$1,800" },
  { id: "BK-1022", traveler: "Amira Khan", package: "Bali Hidden Retreats", status: "completed", date: "Apr 4, 2026", amount: "$3,200" },
  { id: "BK-1021", traveler: "Julian Rivers", package: "Iceland Ring Road", status: "cancelled", date: "Apr 3, 2026", amount: "$4,100" },
  { id: "BK-1020", traveler: "Priya Sharma", package: "Swiss Alps Trek", status: "confirmed", date: "Apr 2, 2026", amount: "$2,900" },
];

const pendingAgencies = [
  { id: 1, name: "Nomad Expeditions", email: "contact@nomadexp.com", submitted: "Apr 5, 2026", location: "Kathmandu, Nepal" },
  { id: 2, name: "AquaVenture Tours", email: "info@aquaventure.co", submitted: "Apr 4, 2026", location: "Phuket, Thailand" },
  { id: 3, name: "EcoStay Travels", email: "hello@ecostay.com", submitted: "Apr 3, 2026", location: "San José, Costa Rica" },
];

const recentActivity = [
  { icon: CheckCircle2, text: "Booking BK-1024 was confirmed", time: "2 hours ago", color: "text-emerald-500" },
  { icon: Users, text: "New traveler registered: Priya Sharma", time: "4 hours ago", color: "text-indigo-500" },
  { icon: AlertTriangle, text: "Refund request for BK-1019", time: "6 hours ago", color: "text-amber-500" },
  { icon: Building2, text: "New agency application: EcoStay Travels", time: "8 hours ago", color: "text-sky-500" },
  { icon: XCircle, text: "Post removed for policy violation", time: "12 hours ago", color: "text-red-500" },
];

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    completed: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[status] || ""}`}>
      {status}
    </span>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Platform Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time insights across the Triplance platform
        </p>
      </div>

      {/* ─── KPI Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Users"
          value="12,847"
          change="+8.2% from last month"
          changeType="up"
          icon={Users}
          color="indigo"
        />
        <StatCard
          label="Total Bookings"
          value="3,624"
          change="+12.5% from last month"
          changeType="up"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          label="Revenue"
          value="$284,900"
          change="+6.1% from last month"
          changeType="up"
          icon={DollarSign}
          color="amber"
        />
        <StatCard
          label="Pending Agencies"
          value="3"
          change="Awaiting approval"
          changeType="neutral"
          icon={Building2}
          color="rose"
        />
      </div>

      {/* ─── Main Grid: Recent Bookings + Activity ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table — 2/3 width */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Bookings
            </h3>
            <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              View All <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-3">Booking ID</th>
                  <th className="px-6 py-3">Traveler</th>
                  <th className="px-6 py-3">Package</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {booking.id}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">
                      {booking.traveler}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                      {booking.package}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">
                      {booking.date}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-slate-900 dark:text-white">
                      {booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity — 1/3 width */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <div className="px-6 py-4 space-y-5">
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                      {item.text}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Pending Agency Approvals ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pending Agency Approvals
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              {pendingAgencies.length}
            </span>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {pendingAgencies.map((agency) => (
            <div
              key={agency.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {agency.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {agency.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {agency.email} • {agency.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-2 hidden sm:inline">
                  {agency.submitted}
                </span>
                <button className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                  Approve
                </button>
                <button className="px-4 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}