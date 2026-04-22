import { StatCard } from "@/components/admin/StatCard";
import {
  DollarSign,
  CalendarCheck,
  Map,
  Star,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
} from "lucide-react";

const recentBookings = [
  { id: "BK-1024", traveler: "Sarah Jenkins",  package: "Sundarbans Safari",  status: "confirmed",  date: "Apr 6, 2026",  amount: "$2,400" },
  { id: "BK-1023", traveler: "Marco Rossi",    package: "Cox's Bazar Tour",    status: "pending",    date: "Apr 5, 2026",  amount: "$1,800" },
  { id: "BK-1022", traveler: "Amira Khan",     package: "Sylhet Tea Retreat",  status: "completed",  date: "Apr 4, 2026",  amount: "$3,200" },
  { id: "BK-1021", traveler: "Julian Rivers",  package: "Bandarban Trek",      status: "cancelled",  date: "Apr 3, 2026",  amount: "$4,100" },
  { id: "BK-1020", traveler: "Priya Sharma",   package: "Sajek Valley",        status: "confirmed",  date: "Apr 2, 2026",  amount: "$2,900" },
];

const recentActivity = [
  { icon: CheckCircle2, text: "Booking BK-1024 was confirmed",            time: "2 hours ago",  color: "text-emerald-500" },
  { icon: Users,        text: "New traveler joined your Sundarbans tour", time: "4 hours ago",  color: "text-indigo-500"  },
  { icon: AlertTriangle,text: "Refund request submitted for BK-1019",     time: "6 hours ago",  color: "text-amber-500"   },
  { icon: Map,          text: "Package 'Bandarban Trek' is almost full",  time: "8 hours ago",  color: "text-sky-500"     },
  { icon: Star,         text: "New 5-star review from Amira Khan",        time: "12 hours ago", color: "text-amber-500"   },
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

export default function AgencyDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Agency Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time insights across your agency operations</p>
      </div>

      {/* KPI Cards — 1 col mobile → 2 col sm → 4 col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard label="Total Revenue"   value="$284,900" change="+6.1% from last month"       changeType="up"      icon={DollarSign}   color="amber"   />
        <StatCard label="Total Bookings"  value="3,624"    change="+12.5% from last month"      changeType="up"      icon={CalendarCheck} color="emerald" />
        <StatCard label="Active Packages" value="12"       change="Currently live"               changeType="neutral" icon={Map}          color="indigo"  />
        <StatCard label="Avg. Rating"     value="4.8 ★"   change="Based on traveler reviews"   changeType="neutral" icon={Star}         color="rose"    />
      </div>

      {/* Main Grid — stacked mobile → side-by-side lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Bookings</h3>
            <a href="/agency-dashboard/bookings" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors">
              View All <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 sm:px-6 py-3">ID</th>
                  <th className="px-4 sm:px-6 py-3">Traveler</th>
                  <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Package</th>
                  <th className="px-4 sm:px-6 py-3">Status</th>
                  <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 sm:px-6 py-3.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{booking.id}</td>
                    <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-900 dark:text-white">{booking.traveler}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-600 dark:text-slate-300 hidden sm:table-cell">{booking.package}</td>
                    <td className="px-4 sm:px-6 py-3.5"><StatusBadge status={booking.status} /></td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden md:table-cell">{booking.date}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right font-semibold text-slate-900 dark:text-white">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="px-4 sm:px-6 py-4 space-y-5">
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${item.color}`}><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{item.text}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />{item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
